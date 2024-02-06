import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAboutDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000, {
    message: 'About must be shorter than or equal to 2000 characters',
  })
  @Expose({ name: 'about' })
  @ApiProperty()
  about: string;
}
