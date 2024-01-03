import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostCommentReplyLike } from '../entities/post-comment-reply-like.entity';
import { PostCommentReply } from '../entities/post-comment-reply.entity';
import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { User } from 'src/modules/auth/entities/user.entity';
import { ErrorMessages } from 'src/interfaces/error-messages.interface';
import { plainToClass } from 'class-transformer';
import { PostLikeSerialization } from '../serializers/post-like.serialization';

@Injectable()
export class PostCommentReplyLikeService {
  constructor(
    @InjectRepository(PostCommentReplyLike)
    private readonly postCommentReplyLikeRepository: Repository<PostCommentReplyLike>,
    @InjectRepository(PostCommentReply)
    private readonly postCommentReplyRepository: Repository<PostCommentReply>,
    private readonly i18nService: I18nService,
  ) {}

  async createReplyLike(uuid: string, user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const reply = await this.postCommentReplyRepository.findOne({
      where: { uuid },
    });
    if (!reply)
      throw new HttpException(
        errorMessage.commentReplyNotFound,
        HttpStatus.BAD_REQUEST,
      );

    const isLiked = await this.postCommentReplyLikeRepository.findOne({
      where: { reply: { id: reply.id }, user: { id: user.id } },
    });
    if (isLiked)
      throw new HttpException(errorMessage.replyAlreadyLiked, HttpStatus.FOUND);

    const replyLikeCreated = this.postCommentReplyLikeRepository.create({
      user,
      reply,
    });
    const replyLike = await this.postCommentReplyLikeRepository.save(
      replyLikeCreated,
    );
    if (!replyLike)
      throw new HttpException(
        errorMessage.failedToLikeReply,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.replyLikedSuccessfully,
      data: this.serializeReplyLikes(replyLike),
    };
  }

  async getReplyLikes(uuid: string, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const reply = await this.postCommentReplyRepository.findOne({
      where: { uuid },
      relations: ['likes', 'likes.user'],
    });
    if (!reply)
      throw new HttpException(
        errorMessage.commentReplyNotFound,
        HttpStatus.NOT_FOUND,
      );

    return {
      data: reply.likes.map((like) => this.serializeReplyLikes(like)),
      total: reply.likes.length || 0,
    };
  }

  async deleteReplyLike(uuid: string, user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const reply = await this.postCommentReplyRepository.findOne({
      where: { uuid },
    });
    if (!reply)
      throw new HttpException(
        errorMessage.commentReplyNotFound,
        HttpStatus.NOT_FOUND,
      );

    const replyLike = await this.postCommentReplyLikeRepository.findOne({
      where: {
        reply: { id: reply.id },
        user: { id: user.id },
      },
    });
    if (!replyLike)
      throw new HttpException(
        errorMessage.replyAlreadyUnLiked,
        HttpStatus.NOT_FOUND,
      );

    const { affected } = await this.postCommentReplyLikeRepository.delete({
      uuid: replyLike.uuid,
    });
    if (!affected)
      throw new HttpException(
        errorMessage.failedToUnLikeReply,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.replyUnLikedSuccessfully,
      data: this.serializeReplyLikes(replyLike),
    };
  }

  serializeReplyLikes(replyLike) {
    return plainToClass(PostLikeSerialization, replyLike, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }
}
