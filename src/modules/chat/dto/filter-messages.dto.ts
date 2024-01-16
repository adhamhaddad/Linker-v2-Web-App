import { Type } from 'class-transformer';
import { IsOptional, IsNumber, Min, IsString, IsEnum } from 'class-validator';

export class FilterMessageFilterDTO {
  @IsOptional()
  @IsString()
  keyword?: string;
}

export class FilterMessageDTO {
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
  @Type(() => FilterMessageFilterDTO)
  filter?: FilterMessageFilterDTO;

  @IsOptional()
  sort?: string;
}
