import { Expose, Type } from 'class-transformer';
import { RequestStatus } from 'src/constants/request-status';
import { GetUserSerialization } from 'src/modules/user/serializers/get-user.serialization';

export class FriendRequestSerialization {
  @Expose({ name: 'uuid' })
  id: string;

  @Expose({ name: 'status' })
  status: RequestStatus;

  @Type(() => GetUserSerialization)
  @Expose({ name: 'recipient' })
  user: GetUserSerialization;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;
}
