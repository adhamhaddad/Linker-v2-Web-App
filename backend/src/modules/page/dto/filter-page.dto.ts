import { Type } from 'class-transformer';
import { IsOptional, IsNumber, Min, IsString, IsEnum } from 'class-validator';
import { PageStatusType } from '../interfaces/page.interface';

export class FilterPageFilterDTO {
  @IsOptional()
  @IsString()
  keyword?: string;
}

export class FilterPageDTO {
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
  @Type(() => FilterPageFilterDTO)
  filter?: FilterPageFilterDTO;

  @IsOptional()
  @IsEnum(PageStatusType)
  status?: PageStatusType;

  @IsOptional()
  sort?: string;
}
