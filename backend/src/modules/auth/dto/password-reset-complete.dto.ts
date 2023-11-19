import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';

export class PasswordResetCompleteDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'confirmPassword' })
  confirm_password: string;

  @IsString()
  otp: string;
}
