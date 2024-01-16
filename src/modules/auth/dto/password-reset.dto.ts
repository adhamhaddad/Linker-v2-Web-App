import { IsString, IsNotEmpty } from 'class-validator';

export class PasswordResetDto {
  @IsString()
  @IsNotEmpty()
  username: string;
}
