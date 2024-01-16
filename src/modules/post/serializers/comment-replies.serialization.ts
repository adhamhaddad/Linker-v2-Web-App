import { Expose, Type } from 'class-transformer';
import { GetUserSerialization } from 'src/modules/user/serializers/get-user.serialization';
import { PostLikeSerialization } from './post-like.serialization';

export class CommentRepliesSerialization {
  @Expose({ name: 'uuid' })
  id: string;

  @Type(() => GetUserSerialization)
  @Expose({ name: 'user' })
  user: GetUserSerialization;

  @Expose({ name: 'reply' })
  reply: string;

  @Expose({ name: 'images' })
  images: string[] | [];

  @Expose({ name: 'videos' })
  videos: string[] | [];

  @Type(() => PostLikeSerialization)
  @Expose({ name: 'likes' })
  likes: PostLikeSerialization[];

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;
}
