import { Expose, Type } from 'class-transformer';
import { RequestStatus } from 'src/constants/request-status';
import { UserSerialization } from 'src/modules/auth/serializers/user.serialization';
import { RelationshipSerialization } from './relationship.serialization';

export class RelationshipRequestSerialization {
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

  @Type(() => RelationshipSerialization)
  @Expose({ name: 'relation' })
  relation: RelationshipSerialization;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;
}
