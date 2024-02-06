import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ChatType } from '../interfaces/chat.interface';

export class CreateChatDto {
  @IsNumber()
  @IsNotEmpty()
  @Expose({ name: 'userId' })
  userId: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(ChatType)
  type: ChatType;
}
