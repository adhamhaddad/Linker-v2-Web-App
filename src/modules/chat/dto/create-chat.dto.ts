import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ChatType } from '../interfaces/chat.interface';

export class CreateChatDto {
  @IsNumber()
  @IsNotEmpty()
  userUuid: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(ChatType)
  type: ChatType;
}
