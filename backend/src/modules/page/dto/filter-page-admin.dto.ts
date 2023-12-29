import { Type } from 'class-transformer';
import { IsOptional, IsNumber, Min, IsString, IsEnum } from 'class-validator';
import { PageAdminRole } from '../interfaces/page-admin.interface';

export class FilterPageAdminFilterDTO {
  @IsOptional()
  @IsString()
  keyword?: string;
}

export class FilterPageAdminDTO {
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
  @Type(() => FilterPageAdminFilterDTO)
  filter?: FilterPageAdminFilterDTO;

  @IsOptional()
  @IsEnum(PageAdminRole)
  role?: PageAdminRole;

  @IsOptional()
  sort?: string;
}
