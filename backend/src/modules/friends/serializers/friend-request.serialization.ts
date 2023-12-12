import { Expose, Type } from 'class-transformer';
import { RequestStatus } from '../interfaces/friend-request.interface';
import { UserSerialization } from 'src/modules/auth/serializers/user.serialization';

export class FriendRequestSerialization {
  @Expose({ name: 'uuid' })
  id: string;

  @Expose({ name: 'status' })
  status: RequestStatus;

  @Type(() => UserSerialization)
  @Expose({ name: 'requester' })
  requester: UserSerialization;

  @Type(() => UserSerialization)
  @Expose({ name: 'recipient' })
  recipient: UserSerialization;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;
}
