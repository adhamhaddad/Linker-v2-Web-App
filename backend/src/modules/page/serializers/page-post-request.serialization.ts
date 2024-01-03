import { Expose, Type } from 'class-transformer';
import { RequestStatus } from 'src/constants/request-status';
import { PostSerialization } from 'src/modules/post/serializers/post.serialization';
import { GetUserSerialization } from 'src/modules/user/serializers/get-user.serialization';

export class PagePostRequestSerialization {
  @Expose({ name: 'uuid' })
  id: string;

  @Expose({ name: 'status' })
  status: RequestStatus;

  @Type(() => GetUserSerialization)
  @Expose({ name: 'user' })
  admin: GetUserSerialization;

  @Type(() => PostSerialization)
  @Expose({ name: 'post' })
  post: PostSerialization;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;
}
