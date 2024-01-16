import { GroupUserRole } from 'src/modules/group/interfaces/group-member.interface';

export const GroupPermissions = {
  OwnerPermission: [GroupUserRole.OWNER],
  SuperPermission: [GroupUserRole.OWNER, GroupUserRole.SUPER_ADMIN],
  AdminPermission: [
    GroupUserRole.OWNER,
    GroupUserRole.SUPER_ADMIN,
    GroupUserRole.ADMIN,
  ],
  HighPermission: [
    GroupUserRole.OWNER,
    GroupUserRole.SUPER_ADMIN,
    GroupUserRole.ADMIN,
    GroupUserRole.MODERATOR,
  ],
  AllPermissions: [
    GroupUserRole.OWNER,
    GroupUserRole.SUPER_ADMIN,
    GroupUserRole.ADMIN,
    GroupUserRole.MODERATOR,
    GroupUserRole.MEMBER,
  ],
  MemberPermission: [GroupUserRole.MEMBER],
};
