import { Type } from 'class-transformer';
import { IsOptional, IsNumber, Min, IsString, IsEnum } from 'class-validator';
import { RequestStatus } from 'src/constants/request-status';

export class FilterGroupRequestFilterDTO {
  @IsOptional()
  @IsString()
  keyword?: string;
}

export class FilterGroupRequestDTO {
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
  @Type(() => FilterGroupRequestFilterDTO)
  filter?: FilterGroupRequestFilterDTO;

  @IsOptional()
  @IsEnum(RequestStatus)
  status?: RequestStatus;

  @IsOptional()
  sort?: string;
}
