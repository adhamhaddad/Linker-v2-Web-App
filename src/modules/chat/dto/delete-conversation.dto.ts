import { IsNotEmpty, IsString } from 'class-validator';

export enum DeleteConversationType {
  ME = 'me',
  EVERYONE = 'everyone',
}

export class DeleteConversationDto {
  @IsString()
  @IsNotEmpty()
  deleteFrom: DeleteConversationType;
}
