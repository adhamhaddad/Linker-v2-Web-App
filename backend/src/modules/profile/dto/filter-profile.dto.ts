import { Type } from 'class-transformer';
import { IsOptional, IsNumber, Min, IsString, IsEnum } from 'class-validator';

export class FilterProfileFilterDTO {
  @IsOptional()
  @IsString()
  keyword?: string;
}

export class FilterProfileDTO {
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
  @Type(() => FilterProfileFilterDTO)
  filter?: FilterProfileFilterDTO;

  @IsOptional()
  sort?: string;
}
