import { IsString, IsNotEmpty } from 'class-validator';

export class SendOTPDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  source: string;
}
