import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, OrderByCondition, Repository } from 'typeorm';
import { PageAdmin } from '../entities/page-admin.entity';
import { I18nService } from 'nestjs-i18n';
import { User } from 'src/modules/auth/entities/user.entity';
import { ErrorMessages } from 'src/interfaces/error-messages.interface';
import { plainToClass } from 'class-transformer';
import { Page } from '../entities/page.entity';
import { IPageAdmin, PageAdminRole } from '../interfaces/page-admin.interface';
import { CreatePageAdminDto } from '../dto/create-page-admin.dto';
import { UpdatePageAdminDto } from '../dto/update-page-admin.dto';
import { FilterPageAdminDTO } from '../dto/filter-page-admin.dto';
import { PageAdminSerialization } from '../serializers/page-admin.serialization';
import { PageService } from './page.service';

@Injectable()
export class PageAdminService {
  constructor(
    @InjectRepository(PageAdmin)
    private readonly pageAdminRepository: Repository<PageAdmin>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly pageService: PageService,
    private readonly i18nService: I18nService,
  ) {}

  // Helper function to check my authority
  async isHasAuthority(pageUuid: string, adminUuid: string) {
    const pageAdmin = await this.pageAdminRepository.findOne({
      where: {
        page: { uuid: pageUuid },
        admin: { uuid: adminUuid },
        role: In(['owner', 'super admin', 'admin', 'moderator']),
      },
      relations: ['admin'],
    });

    return pageAdmin || false;
  }

  async createPageAdmin(
    pageUuid: string,
    userUuid: string,
    body: CreatePageAdminDto,
    user: User,
    lang: string,
  ) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    // Check page exist
    const page = await this.pageService.getPageByUuid(pageUuid, lang);

    // Check user exist
    const admin = await this.userRepository.findOne({
      where: { uuid: userUuid },
    });
    if (!admin)
      throw new HttpException(errorMessage.userNotFound, HttpStatus.NOT_FOUND);

    // Check if is already admin
    const isAdmin = await this.isHasAuthority(pageUuid, userUuid);
    if (isAdmin)
      throw new HttpException(errorMessage.pageAdminExist, HttpStatus.FOUND);

    // Check user has authority to add admins
    const userAuthority = await this.isHasAuthority(pageUuid, user.uuid);
    if (!userAuthority)
      throw new HttpException(errorMessage.notAuthorized, HttpStatus.NOT_FOUND);

    if (userAuthority.role !== PageAdminRole.OWNER)
      throw new HttpException(
        errorMessage.notAuthorized,
        HttpStatus.UNAUTHORIZED,
      );

    // Create page admin
    const pageAdminCreated = this.pageAdminRepository.create({
      admin,
      page,
      role: body.role,
    });
    const pageAdmin = await this.pageAdminRepository.save(pageAdminCreated);
    if (!pageAdmin)
      throw new HttpException(
        errorMessage.failedToCreatePageAdmin,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.pageAdminCreatedSuccessfully,
      data: this.serializePageAdmin(pageAdmin),
    };
  }

  async getPageAdmins(
    uuid: string,
    query: FilterPageAdminDTO,
    user: User,
    lang: string,
  ) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const authorityMember = await this.isHasAuthority(uuid, user.uuid);
    if (!authorityMember)
      throw new HttpException(
        errorMessage.notAuthorized,
        HttpStatus.UNAUTHORIZED,
      );

    const selector: Partial<IPageAdmin> = {};
    const order: OrderByCondition = { 'pageAdmin.created_at': 'DESC' };
    query.paginate = query.paginate || 15;
    query.page = query.page || 1;
    const skip = (query.page - 1) * query.paginate;

    const qb = this.pageAdminRepository
      .createQueryBuilder('pageAdmin')
      .leftJoinAndSelect('pageAdmin.page', 'page')
      .leftJoinAndSelect('pageAdmin.admin', 'admin')
      .andWhere('pageAdmin.page = :pageUuid', { pageUuid: uuid })
      .where(selector)
      .orderBy(order)
      .skip(skip)
      .take(query.paginate);

    const [admins, total] = await qb.getManyAndCount();

    const data = admins.map((admin) => this.serializePageAdmin(admin));

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

  async updatePageAdmin(
    pageUuid: string,
    adminUuid: string,
    body: UpdatePageAdminDto,
    user: User,
    lang: string,
  ) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const { role } = body;

    const pageAdmin = await this.pageAdminRepository.findOne({
      where: {
        uuid: adminUuid,
        page: { uuid: pageUuid, creator: { id: user.id } },
      },
      relations: ['page', 'admin'],
    });
    if (!pageAdmin)
      throw new HttpException(
        errorMessage.pageAdminNotFound,
        HttpStatus.NOT_FOUND,
      );

    pageAdmin.role = UpdatePageAdminDto[role.toUpperCase()];
    const updatedPageAdmin = await this.pageAdminRepository.save(pageAdmin);

    if (!updatedPageAdmin)
      throw new HttpException(
        errorMessage.failedToUpdatePageAdmin,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.pageAdminUpdatedSuccessfully,
      data: this.serializePageAdmin(updatedPageAdmin),
    };
  }

  async deletePageAdmin(
    pageUuid: string,
    adminUuid: string,
    user: User,
    lang: string,
  ) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      { lang },
    );

    const pageAdmin = await this.pageAdminRepository.findOne({
      where: {
        uuid: adminUuid,
        page: { uuid: pageUuid, creator: { id: user.id } },
      },
      relations: ['page', 'admin'],
    });
    if (!pageAdmin)
      throw new HttpException(
        errorMessage.pageAdminNotFound,
        HttpStatus.NOT_FOUND,
      );

    pageAdmin.role = UpdatePageAdminDto[status.toUpperCase()];
    const updatedGroupRequest = await this.pageAdminRepository.delete({
      uuid: adminUuid,
    });

    if (!updatedGroupRequest)
      throw new HttpException(
        errorMessage.failedToDeletePageAdmin,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.pageAdminDeletedSuccessfully,
      data: this.serializePageAdmin(updatedGroupRequest),
    };
  }

  serializePageAdmin(pageAdmin) {
    return plainToClass(PageAdminSerialization, pageAdmin, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }
}
