import { Expose, Type } from 'class-transformer';
import { UserSerialization } from 'src/modules/auth/serializers/user.serialization';

export class RecipientSerialization {
  @Expose({ name: 'uuid' })
  id: string;

  @Type(() => UserSerialization)
  @Expose({ name: 'recipient' })
  recipient: UserSerialization;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;
}
