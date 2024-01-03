import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentReplyDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  reply: string;

  @IsOptional()
  @IsArray()
  images: [];

  @IsOptional()
  @IsArray()
  videos: [];
}
