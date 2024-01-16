import { IsNotEmpty, IsString } from 'class-validator';

export enum DeleteChatType {
  ME = 'me',
  EVERYONE = 'everyone',
}

export class DeleteChatDto {
  @IsString()
  @IsNotEmpty()
  deleteFrom: DeleteChatType;
}
