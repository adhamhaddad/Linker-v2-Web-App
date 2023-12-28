import { IsEnum, IsString } from 'class-validator';
import { GroupUserRole } from '../interfaces/group-member.interface';

export class UpdateGroupMemberDto {
  @IsString()
  @IsEnum(GroupUserRole)
  role: GroupUserRole;
}
