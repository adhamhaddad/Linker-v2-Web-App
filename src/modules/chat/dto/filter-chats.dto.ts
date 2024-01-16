import { Type } from 'class-transformer';
import {
  IsOptional,
  IsNumber,
  Min,
  IsString,
  IsBoolean,
} from 'class-validator';

export class FilterChatFilterDTO {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  archived?: boolean;
}

export class FilterChatDTO {
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
  @Type(() => FilterChatFilterDTO)
  filter?: FilterChatFilterDTO;

  @IsOptional()
  sort?: string;
}
