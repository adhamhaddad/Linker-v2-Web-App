import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateReactionDto {
  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'reactIcon' })
  reactIcon: string;
}
