import { Type } from 'class-transformer';
import { IsOptional, IsNumber, Min, IsString, IsEnum } from 'class-validator';
import { GroupStatusType } from '../interfaces/group.interface';

export class FilterGroupFilterDTO {
  @IsOptional()
  @IsString()
  keyword?: string;
}

export class FilterGroupDTO {
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
  @Type(() => FilterGroupFilterDTO)
  filter?: FilterGroupFilterDTO;

  @IsOptional()
  @IsEnum(GroupStatusType)
  status?: GroupStatusType;

  @IsOptional()
  sort?: string;
}
