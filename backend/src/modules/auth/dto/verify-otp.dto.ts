import { IsString, IsNotEmpty } from 'class-validator';

export class VerifyOTPDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  otp: string;
}
