import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { UserActivityTypeMessages } from 'src/constants/user-activity-type';

export class UserActivityDTO {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => {
    if (value.startsWith('::ffff:')) {
      return value.replace('::ffff:', '');
    }
    return value;
  })
  login_ip_address: string;

  @IsNotEmpty()
  @IsString()
  device_os: string;

  @IsNotEmpty()
  @IsString()
  device_model: string;

  @IsNotEmpty()
  @IsString()
  user_agent: string;

  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @IsNumber()
  type: UserActivityTypeMessages;
}
