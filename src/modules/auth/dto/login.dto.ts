import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'username' })
  @ApiProperty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'password' })
  @ApiProperty()
  password: string;
}
