import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCommentReplyDto {
  @IsNotEmpty()
  @IsString()
  reply: string;
}
