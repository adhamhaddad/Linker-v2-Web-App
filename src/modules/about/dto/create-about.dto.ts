import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateAboutDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000, {
    message: 'About must be shorter than or equal to 2000 characters',
  })
  @Expose({ name: 'about' })
  about: string;
}
