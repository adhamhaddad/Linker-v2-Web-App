import { Type } from 'class-transformer';
import { IsOptional, IsNumber, Min, IsString, IsEnum } from 'class-validator';
import { PostProviderTypes, PostStatus } from '../interfaces/post.interface';

export class FilterPostFilterDTO {
  @IsOptional()
  @IsString()
  keyword?: string;
}

export class FilterPostDTO {
  // paginate
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  paginate?: number;

  // page
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @Type(() => FilterPostFilterDTO)
  filter?: FilterPostFilterDTO;

  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;

  @IsOptional()
  sort?: string;

  @IsOptional()
  @IsEnum(PostProviderTypes)
  providerType: PostProviderTypes;

  @IsOptional()
  @IsString()
  providerId: string;
}
