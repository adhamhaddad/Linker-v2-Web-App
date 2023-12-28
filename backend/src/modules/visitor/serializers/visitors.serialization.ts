import { Expose, Type } from 'class-transformer';
import { GetUserSerialization } from 'src/modules/user/serializers/get-user.serialization';

export class VisitorSerialization {
  @Expose({ name: 'uuid' })
  id: string;

  @Type(() => GetUserSerialization)
  @Expose({ name: 'visitor' })
  visitor: GetUserSerialization;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;
}
