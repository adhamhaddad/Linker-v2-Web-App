import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../entities/post.entity';
import { DeepPartial, OrderByCondition, Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { User } from 'src/modules/auth/entities/user.entity';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { ErrorMessages } from 'src/interfaces/error-messages.interface';
import { plainToClass } from 'class-transformer';
import { PostSerialization } from '../serializers/post.serialization';
import { IPost, PostProviderTypes } from '../interfaces/post.interface';
import { Profile } from 'src/modules/profile/entities/profile.entity';
import { Page } from 'src/modules/page/entities/page.entity';
import { Group } from 'src/modules/group/entities/group.entity';
import { PageAdminService } from 'src/modules/page/services/page-admin.service';
import { FilterPostDTO } from '../dto/filter-post.dto';
import { ProfileService } from 'src/modules/profile/services/profile.service';
import { PageService } from 'src/modules/page/services/page.service';
import { GroupService } from 'src/modules/group/services/group.service';
import { GroupPermissions, PagePermissions } from 'src/constants';
import { GroupMemberService } from 'src/modules/group/services/group-member.service';
import { GroupPostRequestService } from 'src/modules/group/services/group-post-request.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly profileService: ProfileService,
    @InjectRepository(Page)
    private readonly pageRepository: Repository<Page>,
    private readonly pageService: PageService,
    private readonly pageAdminService: PageAdminService,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    private readonly groupService: GroupService,
    private readonly groupMemberService: GroupMemberService,
    // private readonly groupPostRequestService: GroupPostRequestService,
    private readonly i18nService: I18nService,
  ) {}

  private async getProvider(uuid, type, lang) {
    if (type === PostProviderTypes.PROFILE) {
      return await this.profileService.checkProfile(uuid, lang);
    } else if (type === PostProviderTypes.PAGE) {
      return await this.pageService.checkPage(uuid, lang);
    } else {
      return await this.groupService.checkGroup(uuid, lang);
    }
  }

  // ProviderId Profile Checks
  private async checkProfileProvider(
    providerUuid: string,
    user: User,
    lang: string,
  ) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const profile = await this.profileRepository.findOne({
      where: { uuid: providerUuid, user: { id: user.id } },
    });
    if (!profile)
      throw new HttpException(
        errorMessage.profileNotFound,
        HttpStatus.NOT_FOUND,
      );

    return profile.id;
  }

  // ProviderId Page Checks
  private async checkPageProvider(
    providerUuid: string,
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
      where: { uuid: providerUuid },
    });
    if (!page)
      throw new HttpException(errorMessage.pageNotFound, HttpStatus.NOT_FOUND);

    const isAuthorized = await this.pageAdminService.isHasAuthority(
      providerUuid,
      user.uuid,
      PagePermissions.AdminPermission,
    );
    if (!isAuthorized)
      throw new HttpException(
        errorMessage.notAuthorized,
        HttpStatus.UNAUTHORIZED,
      );

    return page.id;
  }

  // ProviderId Group Checks
  private async checkGroupProvider(
    providerUuid: string,
    user: User,
    lang: string,
  ) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const group = await this.groupRepository.findOne({
      where: { uuid: providerUuid },
    });
    if (!group)
      throw new HttpException(errorMessage.groupNotFound, HttpStatus.NOT_FOUND);

    const isAuthorized = await this.groupMemberService.isHasAuthority(
      providerUuid,
      user.uuid,
      GroupPermissions.AllPermissions,
    );
    if (!isAuthorized)
      throw new HttpException(
        errorMessage.notAuthorized,
        HttpStatus.UNAUTHORIZED,
      );

    if (isAuthorized.role === 'member' || isAuthorized.role === 'moderator') {
      // Create a request
      // await this.groupPostRequestService.createGroupPostRequest(providerUuid,  user, user, lang)
    }

    return group.id;
  }

  async provider(providerType, providerUuid, user, lang) {
    if (providerType === PostProviderTypes.PROFILE) {
      return await this.checkProfileProvider(providerUuid, user, lang);
    } else if (providerType === PostProviderTypes.PAGE) {
      return await this.checkPageProvider(providerUuid, user, lang);
    } else {
      return await this.checkGroupProvider(providerUuid, user, lang);
    }
  }

  async createPost(body: CreatePostDto, user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const provider = await this.provider(
      body.provider_type,
      body.provider,
      user,
      lang,
    );
    // return { message: 'test', data: provider };
    const postCreated = this.postRepository.create({
      creator: user,
      provider_id: provider,
      provider_type: body.provider_type,
      status: body.status,
      caption: body.caption,
      images: body.images || [],
      videos: body.videos || [],
    } as DeepPartial<Post>);
    const post = await this.postRepository.save(postCreated);
    if (!post)
      throw new HttpException(
        errorMessage.failedToCreatePost,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.postCreatedSuccessfully,
      data: this.serializePost(post),
    };
  }

  async getPosts(query: FilterPostDTO, user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );
    const { providerType, providerId, status, filter, sort, paginate, page } =
      query;

    const selector: Partial<IPost> = status ? { status: status } : {};
    const keyword = filter?.keyword;

    let order: OrderByCondition = { 'post.created_at': 'DESC' };

    query.paginate = query.paginate || 15;
    query.page = query.page || 1;
    const skip = (query.page - 1) * query.paginate;

    // Sort
    if (query.sort) {
      const orderDirection = query.sort.startsWith('-') ? 'DESC' : 'ASC';
      const orderKey = query.sort.replace(/^-/, '');
      const postFieldsMap = { status: 'status' };

      if (postFieldsMap[orderKey])
        order = { [postFieldsMap[orderKey]]: orderDirection };
    }

    // Create Query Builder
    const qb = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.creator', 'creator')
      .leftJoinAndSelect('post.likes', 'likes')
      .leftJoinAndSelect('likes.user', 'likeUser')
      .leftJoinAndSelect('post.comments', 'comments')
      .leftJoinAndSelect('comments.user', 'commentUser');

    // Apply filters
    if (Object.keys(selector).length > 0) {
      qb.where(selector);
    }

    if (keyword) {
      qb.andWhere('(post.caption LIKE :keyword', { keyword: `%${keyword}%` });
    }

    // Apply provider and provider type filters
    if (providerType && providerId) {
      const { id } = await this.getProvider(providerId, providerType, lang);

      qb.andWhere('post.provider_id = :providerId', { providerId: id });
      qb.andWhere('post.provider_type = :providerType', { providerType });
    }

    // Apply ordering, pagination
    qb.orderBy(order).skip(skip).take(query.paginate);

    const [posts, total] = await qb.getManyAndCount();

    const data = posts.map((post) => this.serializePost(post));

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

  async getPostById(uuid: string, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const post = await this.postRepository.findOne({
      where: { uuid },
      relations: [
        'creator',
        'likes',
        'likes.user',
        'comments',
        'comments.user',
      ],
    });
    if (!post)
      throw new HttpException(errorMessage.postNotFound, HttpStatus.NOT_FOUND);

    return {
      data: this.serializePost(post),
      meta: {
        likes: post.likes.length || 0,
        comments: post.comments.length || 0,
      },
    };
  }

  async updatePost(
    uuid: string,
    body: UpdatePostDto,
    user: User,
    lang: string,
  ) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const post = await this.postRepository.findOne({
      where: { uuid },
    });
    if (!post)
      throw new HttpException(errorMessage.postNotFound, HttpStatus.NOT_FOUND);

    const updatedPost = await this.postRepository.save({ ...post, ...body });
    if (!updatedPost)
      throw new HttpException(
        errorMessage.failedToUpdatePost,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.postUpdatedSuccessfully,
      data: this.serializePost(updatedPost),
    };
  }

  async deletePost(uuid: string, user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const post = await this.postRepository.findOne({
      where: { uuid, creator: { id: user.id } },
    });
    if (!post)
      throw new HttpException(errorMessage.postNotFound, HttpStatus.NOT_FOUND);

    const { affected } = await this.postRepository.delete({ uuid });
    if (!affected)
      throw new HttpException(
        errorMessage.failedToDeletePost,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.postDeletedSuccessfully,
      data: this.serializePost(post),
    };
  }

  serializePost(post) {
    return plainToClass(PostSerialization, post, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }
}
