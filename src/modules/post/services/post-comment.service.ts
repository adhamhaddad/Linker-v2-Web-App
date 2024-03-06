import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderByCondition, Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { User } from 'src/modules/user/entities/user.entity';
import { ErrorMessages } from 'src/interfaces/error-messages.interface';
import { plainToClass } from 'class-transformer';
import { PostComment } from '../entities/post-comment.entity';
import { CreatePostCommentDto } from '../dto/create-post-comment.dto';
import { UpdatePostCommentDto } from '../dto/update-post-comment.dto';
import { PostCommentSerialization } from '../serializers/post-comment.serialization';
import { Post } from '../entities/post.entity';
import { IPostComment } from '../interfaces/post-comment.interface';

@Injectable()
export class PostCommentService {
  constructor(
    @InjectRepository(PostComment)
    private readonly postCommentRepository: Repository<PostComment>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly i18nService: I18nService,
  ) {}

  async createPostComment(
    uuid: string,
    body: CreatePostCommentDto,
    user: User,
    lang: string,
  ) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const post = await this.postRepository.findOne({ where: { uuid } });
    if (!post)
      throw new HttpException(errorMessage.postNotFound, HttpStatus.NOT_FOUND);

    const postCommentCreated = this.postCommentRepository.create({
      post,
      user,
      comment: body.comment,
      images: body.images || [],
      videos: body.videos || [],
    });
    const postComment = await this.postCommentRepository.save(
      postCommentCreated,
    );
    if (!postComment)
      throw new HttpException(
        errorMessage.failedToCreatePostComment,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.postCommentCreatedSuccessfully,
      data: this.serializePostComments(postComment),
    };
  }

  async getPostComments(uuid: string, query: any, lang: string) {
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

    const selector: Partial<IPostComment> = {};
    let order: OrderByCondition = { 'comment.created_at': 'DESC' };

    query.paginate = query.paginate || 15;
    query.page = query.page || 1;
    const skip = (query.page - 1) * query.paginate;

    // Sort
    if (query.sort) {
      const orderDirection = query.sort.startsWith('-') ? 'DESC' : 'ASC';
      const orderKey = query.sort.replace(/^-/, '');
      const postFieldsMap = { name: 'user.first_name' };

      if (postFieldsMap[orderKey])
        order = { [postFieldsMap[orderKey]]: orderDirection };
    }

    // Create Query Builder
    const qb = this.postCommentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.likes', 'likes')
      .leftJoinAndSelect('likes.user', 'likeUser')
      .leftJoinAndSelect('comment.replies', 'replies')
      .leftJoinAndSelect('comment.post', 'post')
      .where('post.uuid = :postUuid', { postUuid: uuid });

    // Apply filters
    if (Object.keys(selector).length > 0) {
      qb.where(selector);
    }

    // Apply ordering, pagination
    qb.orderBy(order).skip(skip).take(query.paginate);

    const [comments, total] = await qb.getManyAndCount();
    const data = comments.map((comment) => this.serializePostComments(comment));

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

  async getPostCommentById(uuid: string, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const postComment = await this.postCommentRepository.findOne({
      where: { uuid },
      relations: ['user', 'likes', 'likes.user', 'replies', 'replies.user'],
    });
    if (!postComment)
      throw new HttpException(
        errorMessage.postCommentNotFound,
        HttpStatus.NOT_FOUND,
      );

    return {
      data: this.serializePostComments(postComment),
    };
  }

  async updatePostComment(
    uuid: string,
    body: UpdatePostCommentDto,
    user: User,
    lang: string,
  ) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const postComment = await this.postCommentRepository.findOne({
      where: {
        uuid,
        user: { id: user.id },
      },
    });
    if (!postComment)
      throw new HttpException(
        errorMessage.postCommentNotFound,
        HttpStatus.NOT_FOUND,
      );

    postComment.comment = body.comment;
    const updatedPostComment = await this.postCommentRepository.save(
      postComment,
    );
    if (!updatedPostComment)
      throw new HttpException(
        errorMessage.failedToUpdatePostComment,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.postCommentUpdatedSuccessfully,
      data: this.serializePostComments(updatedPostComment),
    };
  }

  async deletePostComment(uuid: string, user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const postComment = await this.postCommentRepository.findOne({
      where: {
        uuid,
        user: { id: user.id },
      },
    });
    if (!postComment)
      throw new HttpException(
        errorMessage.postCommentNotFound,
        HttpStatus.NOT_FOUND,
      );

    const { affected } = await this.postCommentRepository.delete({
      uuid,
    });
    if (!affected)
      throw new HttpException(
        errorMessage.failedToDeletePostComment,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.postCommentDeletedSuccessfully,
      data: this.serializePostComments(postComment),
    };
  }

  serializePostComments(postComment) {
    return plainToClass(PostCommentSerialization, postComment, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }
}
