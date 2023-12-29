import { Expose, Type } from 'class-transformer';
import { GetUserSerialization } from 'src/modules/user/serializers/get-user.serialization';
import { PageAdminRole } from '../interfaces/page-admin.interface';

export class PageAdminSerialization {
  @Expose({ name: 'uuid' })
  id: string;

  @Expose({ name: 'role' })
  role: PageAdminRole;

  @Type(() => GetUserSerialization)
  @Expose({ name: 'admin' })
  admin: GetUserSerialization;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;
}
