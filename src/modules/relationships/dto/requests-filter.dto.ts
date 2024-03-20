import { Type } from 'class-transformer';
import { IsOptional, IsNumber, Min, IsString, IsEnum } from 'class-validator';
import { RequestStatus } from 'src/constants/request-status';

export enum FilterRequestStatus {
  SENT = 'sent',
}

export class FilterRelationRequestFilterDTO {
  @IsOptional()
  @IsString()
  @IsEnum(FilterRequestStatus)
  type?: FilterRequestStatus;
}

export class FilterRelationRequestDTO {
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
  @Type(() => FilterRelationRequestFilterDTO)
  filter?: FilterRelationRequestFilterDTO;

  @IsOptional()
  @IsEnum(RequestStatus)
  status?: RequestStatus;

  @IsOptional()
  sort?: string;
}
