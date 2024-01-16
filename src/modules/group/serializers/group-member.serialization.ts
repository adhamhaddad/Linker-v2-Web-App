import { Expose, Type } from 'class-transformer';
import { GetUserSerialization } from 'src/modules/user/serializers/get-user.serialization';
import { GroupUserRole } from '../interfaces/group-member.interface';

export class GroupMemberSerialization {
  @Expose({ name: 'uuid' })
  id: string;

  @Type(() => GetUserSerialization)
  @Expose({ name: 'member' })
  member: GetUserSerialization;

  @Expose({ name: 'role' })
  role: GroupUserRole;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;
}
