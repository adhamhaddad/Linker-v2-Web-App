import { Expose } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class UpdatePageFollowerDto {
  @IsBoolean()
  @Expose({ name: 'isBanned' })
  is_banned: boolean;
}
