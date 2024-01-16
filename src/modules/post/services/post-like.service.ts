import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../entities/post.entity';
import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { User } from 'src/modules/auth/entities/user.entity';
import { ErrorMessages } from 'src/interfaces/error-messages.interface';
import { plainToClass } from 'class-transformer';
import { PostLike } from '../entities/post-like.entity';
import { PostLikeSerialization } from '../serializers/post-like.serialization';

@Injectable()
export class PostLikeService {
  constructor(
    @InjectRepository(PostLike)
    private readonly postLikeRepository: Repository<PostLike>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly i18nService: I18nService,
  ) {}

  async createPostLike(uuid: string, user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const post = await this.postRepository.findOne({ where: { uuid } });
    if (!post)
      throw new HttpException(
        errorMessage.failedToLikePost,
        HttpStatus.BAD_REQUEST,
      );

    const isLiked = await this.postLikeRepository.findOne({
      where: { post: { id: post.id }, user: { id: user.id } },
    });
    if (isLiked)
      throw new HttpException(errorMessage.postAlreadyLiked, HttpStatus.FOUND);

    const postLikeCreated = this.postLikeRepository.create({
      user,
      post,
    });
    const postLike = await this.postLikeRepository.save(postLikeCreated);
    if (!postLike)
      throw new HttpException(
        errorMessage.failedToLikePost,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.postLikedSuccessfully,
      data: this.serializePostLikes(postLike),
    };
  }

  async getPostLikes(uuid: string, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const post = await this.postRepository.findOne({
      where: { uuid },
      relations: ['likes', 'likes.user'],
    });
    if (!post)
      throw new HttpException(errorMessage.postNotFound, HttpStatus.NOT_FOUND);

    return {
      data: post.likes.map((like) => this.serializePostLikes(like)),
      total: post.likes.length || 0,
    };
  }

  async deletePostLike(uuid: string, user: User, lang: string) {
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

    const postLike = await this.postLikeRepository.findOne({
      where: {
        post: { id: post.id },
        user: { id: user.id },
      },
    });
    if (!postLike)
      throw new HttpException(
        errorMessage.postAlreadyUnLiked,
        HttpStatus.NOT_FOUND,
      );

    const { affected } = await this.postLikeRepository.delete({
      uuid: postLike.uuid,
    });
    if (!affected)
      throw new HttpException(
        errorMessage.failedToUnLikePost,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.postUnLikedSuccessfully,
      data: this.serializePostLikes(post),
    };
  }

  serializePostLikes(postLike) {
    return plainToClass(PostLikeSerialization, postLike, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }
}
