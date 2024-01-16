import { PageAdminRole } from 'src/modules/page/interfaces/page-admin.interface';

export const PagePermissions = {
  OwnerPermission: [PageAdminRole.OWNER],
  SuperPermission: [PageAdminRole.OWNER, PageAdminRole.SUPER_ADMIN],
  AdminPermission: [
    PageAdminRole.OWNER,
    PageAdminRole.SUPER_ADMIN,
    PageAdminRole.ADMIN,
  ],
  HighPermission: [
    PageAdminRole.OWNER,
    PageAdminRole.SUPER_ADMIN,
    PageAdminRole.ADMIN,
    PageAdminRole.MODERATOR,
  ],
  AllPermissions: [
    PageAdminRole.OWNER,
    PageAdminRole.SUPER_ADMIN,
    PageAdminRole.ADMIN,
    PageAdminRole.MODERATOR,
  ],
  LowPermission: [PageAdminRole.MODERATOR],
};
