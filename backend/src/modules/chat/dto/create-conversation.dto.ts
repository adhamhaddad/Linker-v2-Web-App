import { Expose } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateConversationDto {
  @IsString()
  @IsNotEmpty()
  @Expose({ name: '_id' })
  chatId: string;

  @IsArray()
  @IsNotEmpty()
  participants: { _id: number }[];
}
