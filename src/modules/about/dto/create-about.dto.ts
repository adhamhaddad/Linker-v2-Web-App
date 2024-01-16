import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAboutDto {
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'about' })
  about: string;
}
