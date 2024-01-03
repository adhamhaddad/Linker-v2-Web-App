import { Expose, Type } from 'class-transformer';
import { GetUserSerialization } from 'src/modules/user/serializers/get-user.serialization';
import { PostProviderTypes, PostStatus } from '../interfaces/post.interface';
import { PostLikeSerialization } from './post-like.serialization';
import { PostCommentSerialization } from './post-comment.serialization';

export class PostSerialization {
  @Expose({ name: 'uuid' })
  id: string;

  @Expose({ name: 'provider_type' })
  providerType: PostProviderTypes;

  @Type(() => GetUserSerialization)
  @Expose({ name: 'creator' })
  creator: GetUserSerialization;

  @Expose({ name: 'status' })
  status: PostStatus;

  @Expose({ name: 'caption' })
  caption: string | null;

  @Expose({ name: 'images' })
  images: string[] | [];

  @Expose({ name: 'videos' })
  videos: string[] | [];

  @Type(() => PostLikeSerialization)
  @Expose({ name: 'likes' })
  likes: PostLikeSerialization[];

  @Type(() => PostCommentSerialization)
  @Expose({ name: 'comments' })
  comments: PostCommentSerialization[];

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;
}
