export enum PageAdminRole {
  OWNER = 'owner',
  SUPER_ADMIN = 'super admin',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}
export interface IPageAdmin {
  id: number;
  uuid: string;
  role: PageAdminRole;
  created_at: Date;
  updated_at: Date;
}
