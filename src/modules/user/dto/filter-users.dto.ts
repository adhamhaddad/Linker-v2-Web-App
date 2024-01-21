import { Type } from 'class-transformer';
import { IsOptional, IsNumber, Min, IsString, IsEnum } from 'class-validator';

export class FilterUsersFilterDTO {
  @IsOptional()
  @IsString()
  keyword?: string;
}

export class FilterUsersDTO {
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
  @Type(() => FilterUsersFilterDTO)
  filter?: FilterUsersFilterDTO;

  @IsOptional()
  sort?: string;
}
