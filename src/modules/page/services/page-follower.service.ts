import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderByCondition, Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { User } from 'src/modules/user/entities/user.entity';
import { ErrorMessages } from 'src/interfaces/error-messages.interface';
import { plainToClass } from 'class-transformer';
import { PageFollower } from '../entities/page-follower.entity';
import { IPageFollower } from '../interfaces/page-follower.interface';
import { UpdatePageFollowerDto } from '../dto/update-page-follower.dto';
import { PageFollowerSerialization } from '../serializers/page-follower.serialization';
import { PageService } from './page.service';
import { PageAdminService } from './page-admin.service';
import { PagePermissions } from 'src/constants';
import { PageStatusType } from '../interfaces/page.interface';

@Injectable()
export class PageFollowerService {
  constructor(
    @InjectRepository(PageFollower)
    private readonly pageFollowerRepository: Repository<PageFollower>,
    private readonly pageAdminService: PageAdminService,
    private readonly pageService: PageService,
    private readonly i18nService: I18nService,
  ) {}

  // Helper function to check if user already followed the page
  private async isFollowing(pageUuid: string, followerUuid: string) {
    const pageFollower = await this.pageFollowerRepository.findOne({
      where: {
        page: { uuid: pageUuid },
        follower: { uuid: followerUuid },
      },
      relations: ['follower'],
    });

    return pageFollower || false;
  }

  async createPageFollower(pageUuid: string, user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    // Check Page Exist
    const page = await this.pageService.checkPage(pageUuid, lang);

    // Check that user is unFollowing the page
    const isFollowing = await this.isFollowing(pageUuid, user.uuid);
    if (isFollowing)
      throw new HttpException(
        errorMessage.alreadyFollowingPage,
        HttpStatus.FOUND,
      );

    // Follow page
    const pageFollowerCreated = this.pageFollowerRepository.create({
      page,
      follower: user,
    });
    const pageFollower = await this.pageFollowerRepository.save(
      pageFollowerCreated,
    );
    if (!pageFollower)
      throw new HttpException(
        errorMessage.failedToFollowingPage,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.pageFollowingCreatedSuccessfully,
      data: this.serializePageFollowers(pageFollower),
    };
  }

  async getPageFollowers(uuid: string, query: any, user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    // Check that page is exist
    const page = await this.pageService.checkPage(uuid, lang);

    // Check that page is public
    if (page.status === PageStatusType.PRIVATE) {
      // Check that user is following the page
      const isFollowing = await this.isFollowing(uuid, user.uuid);
      if (!isFollowing)
        throw new HttpException(
          errorMessage.notFollowingPage,
          HttpStatus.NOT_FOUND,
        );

      // Check that user is has authority
      // const isAuthority = await this.pageAdminService.isHasAuthority(
      //   uuid,
      //   user.uuid,
      //   PagePermissions.AdminPermission,
      // );
      // if (!isAuthority)
      //   throw new HttpException(
      //     errorMessage.notAuthorized,
      //     HttpStatus.UNAUTHORIZED,
      //   );
    }

    const selector: Partial<IPageFollower> = {};
    const keyword = query.filter?.keyword;
    let order: OrderByCondition = { 'pageFollower.created_at': 'DESC' };
    query.paginate = query.paginate ? query.paginate : 15;
    query.page = query.page ? query.page : 1;
    const skip = (query.page - 1) * query.paginate;

    // Sort
    if (query.sort) {
      const orderDirection = query.sort.startsWith('-') ? 'DESC' : 'ASC';
      const orderKey = query.sort.replace(/^-/, '');
      const pageFollowerFieldsMap = { role: 'role' };

      if (pageFollowerFieldsMap[orderKey])
        order = { [pageFollowerFieldsMap[orderKey]]: orderDirection };
    }

    // Create Query Builder
    const qb = this.pageFollowerRepository
      .createQueryBuilder('pageFollower')
      .leftJoinAndSelect('pageFollower.follower', 'follower')
      .where('pageFollower.page = :pageId', { pageId: page.id });

    // Apply filters
    if (Object.keys(selector).length > 0) {
      qb.where(selector);
    }

    if (keyword) {
      qb.andWhere(
        'pageFollower.title LIKE :keyword OR pageFollower.author LIKE :keyword',
        { keyword: `%${keyword}%` },
      );
    }

    // Apply ordering, pagination
    qb.orderBy(order).skip(skip).take(query.paginate).relation('follower');

    const [followers, total] = await qb.getManyAndCount();

    const data = followers.map((follower) =>
      this.serializePageFollowers(follower),
    );

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

  async updatePageFollower(
    pageUuid: string,
    followerUuid: string,
    body: UpdatePageFollowerDto,
    user: User,
    lang: string,
  ) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    // Check that page exist
    await this.pageService.checkPage(pageUuid, lang);

    // Check that follower is exist
    const isFollowing = await this.isFollowing(pageUuid, followerUuid);
    if (!isFollowing)
      throw new HttpException(
        errorMessage.notFollowingPage,
        HttpStatus.NOT_FOUND,
      );

    // Check that user has authority to update follower
    const isAuthority = await this.pageAdminService.isHasAuthority(
      pageUuid,
      user.uuid,
      PagePermissions.AdminPermission,
    );
    if (!isAuthority)
      throw new HttpException(
        errorMessage.notAuthorized,
        HttpStatus.UNAUTHORIZED,
      );

    // Update follower
    isFollowing.is_banned = body.is_banned;
    const updatedPageFollower = await this.pageFollowerRepository.save(
      isFollowing,
    );
    if (!updatedPageFollower)
      throw new HttpException(
        errorMessage.failedToUpdatePageFollower,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.pageFollowerUpdatedSuccessfully,
      data: updatedPageFollower,
    };
  }

  async deletePageFollower(uuid: string, user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    // Check that page exist
    await this.pageService.checkPage(uuid, lang);

    // Check that user is following the page
    const isFollowing = await this.isFollowing(uuid, user.uuid);
    if (!isFollowing)
      throw new HttpException(
        errorMessage.notFollowingPage,
        HttpStatus.NOT_FOUND,
      );

    // UnFollow page
    const { affected } = await this.pageFollowerRepository.delete({
      uuid: isFollowing.uuid,
    });
    if (!affected)
      throw new HttpException(
        errorMessage.failedToUnFollowPage,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.pageUnFollowingSuccessfully,
      data: { id: isFollowing.uuid },
    };
  }

  serializePageFollowers(follower) {
    return plainToClass(PageFollowerSerialization, follower, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }
}
