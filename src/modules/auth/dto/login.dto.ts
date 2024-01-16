import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'username' })
  username: string;

  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'password' })
  password: string;
}
