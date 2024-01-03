import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostCommentDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  comment: string;

  @IsOptional()
  @IsArray()
  images: [];

  @IsOptional()
  @IsArray()
  videos: [];
}
