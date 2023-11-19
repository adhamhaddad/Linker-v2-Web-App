import { IsString, IsNotEmpty } from 'class-validator';

export class PasswordResetVerifyDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  otp: string;
}
