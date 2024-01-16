import { Expose } from 'class-transformer';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateChatDto {
  @IsBoolean()
  @IsNotEmpty()
  @Expose({ name: 'isMuted' })
  isMuted: boolean;
}
