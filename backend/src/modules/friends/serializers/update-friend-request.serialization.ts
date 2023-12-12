import { Expose } from 'class-transformer';
import { RequestStatus } from '../interfaces/friend-request.interface';

export class UpdateFriendRequestSerialization {
  @Expose({ name: 'uuid' })
  id: string;

  @Expose({ name: 'status' })
  status: RequestStatus;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;
}
