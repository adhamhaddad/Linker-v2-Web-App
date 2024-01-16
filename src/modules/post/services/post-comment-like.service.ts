import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostComment } from '../entities/post-comment.entity';
import { PostCommentLike } from '../entities/post-comment-like.entity';
import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { User } from 'src/modules/auth/entities/user.entity';
import { ErrorMessages } from 'src/interfaces/error-messages.interface';
import { plainToClass } from 'class-transformer';
import { PostLikeSerialization } from '../serializers/post-like.serialization';

@Injectable()
export class PostCommentLikeService {
  constructor(
    @InjectRepository(PostCommentLike)
    private readonly postCommentLikeRepository: Repository<PostCommentLike>,
    @InjectRepository(PostComment)
    private readonly postCommentRepository: Repository<PostComment>,
    private readonly i18nService: I18nService,
  ) {}

  async createCommentLike(uuid: string, user: User, lang: string) {
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
        HttpStatus.BAD_REQUEST,
      );

    const isLiked = await this.postCommentLikeRepository.findOne({
      where: { comment: { id: comment.id }, user: { id: user.id } },
    });
    if (isLiked)
      throw new HttpException(
        errorMessage.commentAlreadyLiked,
        HttpStatus.FOUND,
      );

    const commentLikeCreated = this.postCommentLikeRepository.create({
      user,
      comment,
    });
    const commentLike = await this.postCommentLikeRepository.save(
      commentLikeCreated,
    );
    if (!commentLike)
      throw new HttpException(
        errorMessage.failedToLikeComment,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.commentLikedSuccessfully,
      data: this.serializeCommentLikes(commentLike),
    };
  }

  async getCommentLikes(uuid: string, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const comment = await this.postCommentRepository.findOne({
      where: { uuid },
      relations: ['likes', 'likes.user'],
    });
    if (!comment)
      throw new HttpException(
        errorMessage.postCommentNotFound,
        HttpStatus.NOT_FOUND,
      );

    return {
      data: comment.likes.map((like) => this.serializeCommentLikes(like)),
      total: comment.likes.length || 0,
    };
  }

  async deleteCommentLike(uuid: string, user: User, lang: string) {
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

    const commentLike = await this.postCommentLikeRepository.findOne({
      where: {
        comment: { id: comment.id },
        user: { id: user.id },
      },
    });
    if (!commentLike)
      throw new HttpException(
        errorMessage.commentAlreadyUnLiked,
        HttpStatus.NOT_FOUND,
      );

    const { affected } = await this.postCommentLikeRepository.delete({
      uuid: commentLike.uuid,
    });
    if (!affected)
      throw new HttpException(
        errorMessage.failedToUnLikeComment,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.commentUnLikedSuccessfully,
      data: this.serializeCommentLikes(commentLike),
    };
  }

  serializeCommentLikes(commentLike) {
    return plainToClass(PostLikeSerialization, commentLike, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }
}
