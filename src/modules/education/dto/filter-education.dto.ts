import { Type } from 'class-transformer';
import { IsOptional, IsNumber, Min } from 'class-validator';

export class FilterEducationDTO {
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
  sort?: string;
}
