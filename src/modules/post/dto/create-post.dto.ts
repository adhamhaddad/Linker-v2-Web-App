import { Expose } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PostProviderTypes, PostStatus } from '../interfaces/post.interface';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  provider: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(PostProviderTypes)
  @Expose({ name: 'providerType' })
  provider_type: PostProviderTypes;

  @IsString()
  @IsNotEmpty()
  @IsEnum(PostStatus)
  status: PostStatus;

  @IsOptional()
  @IsString()
  caption: string;

  @IsOptional()
  @IsArray()
  images: string[];

  @IsOptional()
  @IsArray()
  videos: string[];
}
