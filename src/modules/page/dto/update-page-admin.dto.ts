import { IsEnum, IsString } from 'class-validator';
import { PageAdminRole } from '../interfaces/page-admin.interface';

export class UpdatePageAdminDto {
  @IsString()
  @IsEnum(PageAdminRole)
  role: PageAdminRole;
}
