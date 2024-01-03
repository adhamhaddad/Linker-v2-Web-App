import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePostCommentDto {
  @IsString()
  @IsNotEmpty()
  comment: string;
}
