import { Expose, Type } from 'class-transformer';
import { GetUserSerialization } from 'src/modules/user/serializers/get-user.serialization';

export class PostLikeSerialization {
  @Expose({ name: 'uuid' })
  id: string;

  @Type(() => GetUserSerialization)
  @Expose({ name: 'user' })
  user: GetUserSerialization;

  @Expose({ name: 'created_at' })
  createdAt: Date;
}
