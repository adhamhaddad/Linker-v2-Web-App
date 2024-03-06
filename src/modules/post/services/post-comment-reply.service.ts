import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderByCondition, Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { User } from 'src/modules/user/entities/user.entity';
import { ErrorMessages } from 'src/interfaces/error-messages.interface';
import { plainToClass } from 'class-transformer';
import { PostCommentReply } from '../entities/post-comment-reply.entity';
import { PostComment } from '../entities/post-comment.entity';
import { CreateCommentReplyDto } from '../dto/create-comment-reply.dto';
import { UpdateCommentReplyDto } from '../dto/update-comment-reply.dto';
import { CommentRepliesSerialization } from '../serializers/comment-replies.serialization';
import { IPostCommentReply } from '../interfaces/post-comment-reply.interface';

@Injectable()
export class PostCommentReplyService {
  constructor(
    @InjectRepository(PostCommentReply)
    private readonly postCommentReplyRepository: Repository<PostCommentReply>,
    @InjectRepository(PostComment)
    private readonly postCommentRepository: Repository<PostComment>,
    private readonly i18nService: I18nService,
  ) {}

  async createCommentReply(
    uuid: string,
    body: CreateCommentReplyDto,
    user: User,
    lang: string,
  ) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const comment = await this.postCommentRepository.findOne({
      where: { uuid },
    });
    if (!comment)
      throw new HttpException(
        errorMessage.postCommentNotFound,
        HttpStatus.NOT_FOUND,
      );

    const commentReplyCreated = this.postCommentReplyRepository.create({
      comment,
      user,
      reply: body.reply,
      images: body.images || [],
      videos: body.videos || [],
    });
    const commentReply = await this.postCommentReplyRepository.save(
      commentReplyCreated,
    );
    if (!commentReply)
      throw new HttpException(
        errorMessage.failedToCreateCommentReply,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.commentReplyCreatedSuccessfully,
      data: this.serializeCommentReplies(commentReply),
    };
  }

  async getCommentReplies(uuid: string, query: any, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const postComment = await this.postCommentRepository.findOne({
      where: { uuid },
    });
    if (!postComment)
      throw new HttpException(
        errorMessage.postCommentNotFound,
        HttpStatus.NOT_FOUND,
      );

    const selector: Partial<IPostCommentReply> = {};
    let order: OrderByCondition = { 'reply.created_at': 'DESC' };

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
    const qb = this.postCommentReplyRepository
      .createQueryBuilder('reply')
      .leftJoinAndSelect('reply.user', 'user')
      .leftJoinAndSelect('reply.likes', 'likes')
      .leftJoinAndSelect('likes.user', 'likeUser')
      .leftJoinAndSelect('reply.comment', 'comment')
      .where('comment.uuid = :commentUuid', { commentUuid: uuid });

    // Apply filters
    if (Object.keys(selector).length > 0) {
      qb.where(selector);
    }

    // Apply ordering, pagination
    qb.orderBy(order).skip(skip).take(query.paginate);

    const [replies, total] = await qb.getManyAndCount();
    const data = replies.map((reply) => this.serializeCommentReplies(reply));

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

  async getCommentReplyById(uuid: string, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const commentReply = await this.postCommentReplyRepository.findOne({
      where: { uuid },
      relations: ['user', 'likes', 'likes.user'],
    });
    if (!commentReply)
      throw new HttpException(
        errorMessage.commentReplyNotFound,
        HttpStatus.NOT_FOUND,
      );

    return {
      data: this.serializeCommentReplies(commentReply),
    };
  }

  async updateCommentReply(
    uuid: string,
    body: UpdateCommentReplyDto,
    user: User,
    lang: string,
  ) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const commentReply = await this.postCommentReplyRepository.findOne({
      where: { uuid, user: { id: user.id } },
    });
    if (!commentReply)
      throw new HttpException(
        errorMessage.commentReplyNotFound,
        HttpStatus.NOT_FOUND,
      );

    commentReply.reply = body.reply;
    const updatedPostComment = await this.postCommentReplyRepository.save(
      commentReply,
    );
    if (!updatedPostComment)
      throw new HttpException(
        errorMessage.failedToUpdateCommentReply,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.commentReplyUpdatedSuccessfully,
      data: this.serializeCommentReplies(updatedPostComment),
    };
  }

  async deleteCommentReply(uuid: string, user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const commentReply = await this.postCommentReplyRepository.findOne({
      where: {
        uuid,
        user: { id: user.id },
      },
    });
    if (!commentReply)
      throw new HttpException(
        errorMessage.commentReplyNotFound,
        HttpStatus.NOT_FOUND,
      );

    const { affected } = await this.postCommentReplyRepository.delete({
      uuid,
    });
    if (!affected)
      throw new HttpException(
        errorMessage.failedToDeleteCommentReply,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.commentReplyDeletedSuccessfully,
      data: this.serializeCommentReplies(commentReply),
    };
  }

  serializeCommentReplies(commentReply) {
    return plainToClass(CommentRepliesSerialization, commentReply, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }
}
