import { Expose, Type } from 'class-transformer';
import { RequestStatus } from 'src/constants/request-status';
import { GetUserSerialization } from 'src/modules/user/serializers/get-user.serialization';
import { RelationshipSerialization } from './relationship.serialization';

export class RelationshipRequestSerialization {
  @Expose({ name: 'uuid' })
  id: string;

  @Expose({ name: 'status' })
  status: RequestStatus;

  @Type(() => GetUserSerialization)
  @Expose({ name: 'requester' })
  requester: GetUserSerialization;

  @Type(() => GetUserSerialization)
  @Expose({ name: 'recipient' })
  recipient: GetUserSerialization;

  @Type(() => RelationshipSerialization)
  @Expose({ name: 'relation' })
  relation: RelationshipSerialization;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;
}
