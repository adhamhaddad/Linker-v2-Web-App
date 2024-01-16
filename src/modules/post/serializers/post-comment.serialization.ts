import { Expose, Type } from 'class-transformer';
import { GetUserSerialization } from 'src/modules/user/serializers/get-user.serialization';
import { PostLikeSerialization } from './post-like.serialization';
import { CommentRepliesSerialization } from './comment-replies.serialization';

export class PostCommentSerialization {
  @Expose({ name: 'uuid' })
  id: string;

  @Type(() => GetUserSerialization)
  @Expose({ name: 'user' })
  user: GetUserSerialization;

  @Expose({ name: 'comment' })
  comment: string;

  @Expose({ name: 'images' })
  images: string[] | [];

  @Expose({ name: 'videos' })
  videos: string[] | [];

  @Type(() => PostLikeSerialization)
  @Expose({ name: 'likes' })
  likes: PostLikeSerialization[];

  @Type(() => CommentRepliesSerialization)
  @Expose({ name: 'replies' })
  replies: CommentRepliesSerialization[];

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;
}
