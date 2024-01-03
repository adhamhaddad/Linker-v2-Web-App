import { Expose, Type } from 'class-transformer';
import { GetUserSerialization } from 'src/modules/user/serializers/get-user.serialization';
import { GroupMemberSerialization } from './group-member.serialization';

export class GroupSerialization {
  @Expose({ name: 'uuid' })
  id: string;

  @Expose({ name: 'name' })
  name: string;

  @Type(() => GetUserSerialization)
  @Expose({ name: 'creator' })
  creator: GetUserSerialization;

  @Expose({ name: 'description' })
  description: string;

  @Expose({ name: 'rules' })
  rules: string;

  @Expose({ name: 'status' })
  status: Date;

  @Type(() => GroupMemberSerialization)
  @Expose({ name: 'members' })
  members: GroupMemberSerialization;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;
}
