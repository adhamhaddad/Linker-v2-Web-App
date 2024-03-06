import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { OnlineStatus } from 'src/modules/user/interfaces/user.interface';

export class UpdateUserStatus {
  @IsString()
  @IsNotEmpty()
  @IsEnum(OnlineStatus)
  is_online: OnlineStatus;
}
