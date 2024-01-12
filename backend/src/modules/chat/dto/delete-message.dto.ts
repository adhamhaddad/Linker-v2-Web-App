import { IsNotEmpty, IsString } from 'class-validator';

export enum DeleteMessageType {
  ME = 'me',
  EVERYONE = 'everyone',
}

export class DeleteMessageDto {
  @IsString()
  @IsNotEmpty()
  deleteFrom: DeleteMessageType;
}
