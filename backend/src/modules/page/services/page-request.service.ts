import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderByCondition, Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { User } from 'src/modules/auth/entities/user.entity';
import { ErrorMessages } from 'src/interfaces/error-messages.interface';
import { plainToClass } from 'class-transformer';
import {
  UpdateRequestStatus,
  UpdateRequestStatusDto,
} from '../dto/update-post-request.dto';
import { RequestStatus } from 'src/constants/request-status';
import { PagePermissions } from 'src/constants';
import { Post } from 'src/modules/post/entities/post.entity';
import { PagePostRequest } from '../entities/page-post-request.entity';
import { PageAdminService } from './page-admin.service';
import { Page } from '../entities/page.entity';
import { PagePostRequestSerialization } from '../serializers/page-post-request.serialization';
import { FilterPageDTO } from '../dto/filter-page.dto';
import { IPagePostRequest } from '../interfaces/page-post-request.interface';
import { PostService } from 'src/modules/post/services/post.service';
import { PostStatus } from 'src/modules/post/interfaces/post.interface';

@Injectable()
export class PagePostRequestService {
  constructor(
    @InjectRepository(PagePostRequest)
    private readonly pagePostRequestRepository: Repository<PagePostRequest>,
    @InjectRepository(Page)
    private readonly pageRepository: Repository<Page>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly postService: PostService,
    private readonly pageAdminService: PageAdminService,
    private readonly i18nService: I18nService,
  ) {}

  // Helper function to check if a group member request is already sent
  private async isPagePostRequestSent(
    page: Page,
    requester: User,
    post: Post,
  ): Promise<boolean> {
    const pageRequest = await this.pagePostRequestRepository.findOne({
      where: {
        page: { id: page.id },
        requester: { id: requester.id },
        post: { id: post.id },
        status: RequestStatus.PENDING,
      },
    });

    return !!pageRequest;
  }

  async createPagePostRequest(
    pageUuid: string,
    postUuid: string,
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
    const page = await this.pageRepository.findOne({
      where: { uuid: pageUuid },
    });
    if (!page)
      throw new HttpException(errorMessage.pageNotFound, HttpStatus.NOT_FOUND);

    // Check post exist
    const post = await this.postRepository.findOne({
      where: { uuid: postUuid },
    });
    if (!post)
      throw new HttpException(errorMessage.postNotFound, HttpStatus.NOT_FOUND);

    // Check if a post request is already sent
    const isRequested = await this.isPagePostRequestSent(page, user, post);
    if (isRequested) {
      throw new HttpException(
        errorMessage.groupRequestAlreadySent,
        HttpStatus.FOUND,
      );
    }

    // Create post request
    const pageRequestCreated = this.pagePostRequestRepository.create({
      requester: user,
      page: page,
      post: post,
    });
    const pagePostRequest = await this.pagePostRequestRepository.save(
      pageRequestCreated,
    );
    if (!pagePostRequest)
      throw new HttpException(
        errorMessage.failedToSendGroupRequest,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.groupRequestSentSuccessfully,
      data: this.serializePagePostRequest(pagePostRequest),
    };
  }

  async getPagePostRequests(
    uuid: string,
    query: FilterPageDTO,
    user: User,
    lang: string,
  ) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const isAdmin = await this.pageAdminService.isHasAuthority(
      uuid,
      user.uuid,
      PagePermissions.AdminPermission,
    );
    if (!isAdmin)
      throw new HttpException(
        errorMessage.notAuthorized,
        HttpStatus.UNAUTHORIZED,
      );

    const selector: Partial<IPagePostRequest> = {
      status: RequestStatus.PENDING,
      //@ts-ignore
      page: { uuid },
    };
    const order: OrderByCondition = { 'postRequest.created_at': 'DESC' };
    query.paginate = query.paginate || 15;
    query.page = query.page || 1;
    const skip = (query.page - 1) * query.paginate;

    const qb = this.pagePostRequestRepository
      .createQueryBuilder('postRequest')
      .leftJoinAndSelect('postRequest.requester', 'requester')
      .leftJoinAndSelect('postRequest.page', 'page')
      .andWhere('postRequest.page = :pageUuid', { pageUuid: uuid })
      .where(selector)
      .orderBy(order)
      .skip(skip)
      .take(query.paginate);

    const [requests, total] = await qb.getManyAndCount();

    const data = requests.map((request) =>
      this.serializePagePostRequest(request),
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

  async updateGroupRequest(
    pageUuid: string,
    requestUuid: string,
    body: UpdateRequestStatusDto,
    user: User,
    lang: string,
  ) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const { status } = body;

    const pagePostRequest = await this.pagePostRequestRepository.findOne({
      where: {
        uuid: requestUuid,
        page: { uuid: pageUuid },
      },
      relations: ['requester', 'post'],
    });
    if (!pagePostRequest)
      throw new HttpException(errorMessage.pageNotFound, HttpStatus.NOT_FOUND);

    if (pagePostRequest.status !== RequestStatus.PENDING)
      throw new HttpException(
        errorMessage.groupRequestAlreadyUpdated,
        HttpStatus.BAD_REQUEST,
      );

    // Is user has authority to update request
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

    pagePostRequest.status = UpdateRequestStatus[status.toUpperCase()];
    const updatedGroupRequest = await this.pagePostRequestRepository.save(
      pagePostRequest,
    );

    if (status === UpdateRequestStatus.ACCEPTED) {
      // Publish Post
      await this.postService.updatePost(
        pagePostRequest.post.uuid,
        {
          status: PostStatus.PUBLIC,
          created_at: new Date(),
        },
        user,
        lang,
      );
    }

    if (!updatedGroupRequest)
      throw new HttpException(
        errorMessage.failedToUpdateGroupRequest,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.groupRequestUpdatedSuccessfully,
      data: this.serializePagePostRequest(updatedGroupRequest),
    };
  }

  serializePagePostRequest(pagePostRequest) {
    return plainToClass(PagePostRequestSerialization, pagePostRequest, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }
}
