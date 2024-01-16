import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderByCondition, Repository } from 'typeorm';
import { Page } from '../entities/page.entity';
import { I18nService } from 'nestjs-i18n';
import { CreatePageDto } from '../dto/create-page.dto';
import { User } from 'src/modules/auth/entities/user.entity';
import { ErrorMessages } from 'src/interfaces/error-messages.interface';
import { UpdatePageDto } from '../dto/update-page.dto';
import { plainToClass } from 'class-transformer';
import { PageSerialization } from '../serializers/page.serialization';
import { FilterPageDTO } from '../dto/filter-page.dto';
import { IPage } from '../interfaces/page.interface';
import { PageAdminService } from './page-admin.service';
import { PagePermissions } from 'src/constants';

@Injectable()
export class PageService {
  constructor(
    @InjectRepository(Page)
    private readonly pageRepository: Repository<Page>,
    private readonly pageAdminService: PageAdminService,
    private readonly i18nService: I18nService,
  ) {}

  // Helper function to check page exist
  async checkPage(uuid: string, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const page = await this.pageRepository.findOne({
      where: { uuid },
    });
    if (!page)
      throw new HttpException(errorMessage.pageNotFound, HttpStatus.NOT_FOUND);

    return page;
  }

  async createPage(body: CreatePageDto, user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const pageCreated = this.pageRepository.create({
      creator: user,
      ...body,
    });
    const page = await this.pageRepository.save(pageCreated);
    if (!page)
      throw new HttpException(
        errorMessage.failedToCreatePage,
        HttpStatus.BAD_REQUEST,
      );

    await this.pageAdminService.createPageOwner(page, user, lang);

    return {
      message: errorMessage.pageCreatedSuccessfully,
      data: this.serializePage(page),
    };
  }

  async getPages(query: FilterPageDTO) {
    const selector: Partial<IPage> = query.status
      ? { status: query.status }
      : {};
    const keyword = query.filter?.keyword;
    let order: OrderByCondition = { 'page.created_at': 'DESC' };

    query.paginate = query.paginate || 15;
    query.page = query.page || 1;
    const skip = (query.page - 1) * query.paginate;

    // Sort
    if (query.sort) {
      const orderDirection = query.sort.startsWith('-') ? 'DESC' : 'ASC';
      const orderKey = query.sort.replace(/^-/, '');
      const pageFieldsMap = { name: 'name', status: 'status' };

      if (pageFieldsMap[orderKey])
        order = { [pageFieldsMap[orderKey]]: orderDirection };
    }

    // Create Query Builder
    const qb = this.pageRepository
      .createQueryBuilder('page')
      .leftJoinAndSelect('page.creator', 'creator');

    // Apply filters
    if (Object.keys(selector).length > 0) {
      qb.where(selector);
    }

    if (keyword) {
      qb.andWhere(
        '(page.name LIKE :keyword OR page.description LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    // Apply ordering, pagination
    qb.orderBy(order).skip(skip).take(query.paginate);

    const [pages, total] = await qb.getManyAndCount();

    const data = pages.map((page) => this.serializePage(page));

    return {
      data,
      total,
      meta: {
        total,
        currentPage: query.page,
        eachPage: query.paginate,
        lastPage: Math.ceil(total / query.paginate),
      },
    };
  }

  async getPageById(uuid: string, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const page = await this.pageRepository.findOne({
      where: { uuid },
      relations: ['creator', 'followers'],
    });
    if (!page)
      throw new HttpException(errorMessage.pageNotFound, HttpStatus.NOT_FOUND);

    const followersCount = page.followers.length || 0;
    return {
      data: {
        ...this.serializePage(page),
        followersCount,
      },
    };
  }

  async updatePage(
    uuid: string,
    body: UpdatePageDto,
    user: User,
    lang: string,
  ) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const page = await this.pageRepository.findOne({
      where: { uuid },
    });
    if (!page)
      throw new HttpException(errorMessage.pageNotFound, HttpStatus.NOT_FOUND);

    const isAdmin = await this.pageAdminService.isHasAuthority(
      uuid,
      user.uuid,
      PagePermissions.SuperPermission,
    );
    if (!isAdmin)
      throw new HttpException(
        errorMessage.notAuthorized,
        HttpStatus.UNAUTHORIZED,
      );

    const updatedPage = await this.pageRepository.save({ ...page, ...body });
    if (!updatedPage)
      throw new HttpException(
        errorMessage.failedToUpdatePage,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.pageUpdatedSuccessfully,
      data: this.serializePage(updatedPage),
    };
  }

  async deletePage(uuid: string, user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const page = await this.pageRepository.findOne({
      where: { uuid },
    });
    if (!page)
      throw new HttpException(errorMessage.pageNotFound, HttpStatus.NOT_FOUND);

    const isOwner = await this.pageAdminService.isHasAuthority(
      uuid,
      user.uuid,
      PagePermissions.OwnerPermission,
    );
    if (!isOwner)
      throw new HttpException(
        errorMessage.notAuthorized,
        HttpStatus.UNAUTHORIZED,
      );

    const { affected } = await this.pageRepository.delete({ uuid });
    if (!affected)
      throw new HttpException(
        errorMessage.failedToDeletePage,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.pageDeletedSuccessfully,
      data: this.serializePage(page),
    };
  }

  serializePage(page) {
    return plainToClass(PageSerialization, page, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }
}
