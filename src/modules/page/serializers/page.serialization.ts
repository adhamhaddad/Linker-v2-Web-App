import { Expose, Type } from 'class-transformer';
import { PostSerialization } from 'src/modules/post/serializers/post.serialization';
import { GetUserSerialization } from 'src/modules/user/serializers/get-user.serialization';

export class PageSerialization {
  @Expose({ name: 'uuid' })
  id: string;

  @Expose({ name: 'name' })
  name: string;

  @Type(() => GetUserSerialization)
  @Expose({ name: 'creator' })
  creator: GetUserSerialization;

  @Expose({ name: 'description' })
  description: string;

  @Expose({ name: 'status' })
  status: Date;

  @Type(() => PostSerialization)
  @Expose({ name: 'posts' })
  posts: PostSerialization[];

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;
}
