export enum GroupUserRole {
  OWNER = 'owner',
  SUPER_ADMIN = 'super admin',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  MEMBER = 'member',
}

export interface IGroupMember {
  id: number;
  uuid: string;
  role: GroupUserRole;
  created_at: Date;
  updated_at: Date;
}
