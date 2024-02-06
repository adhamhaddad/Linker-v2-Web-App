import { Type } from 'class-transformer';
import { IsOptional, IsNumber, Min, IsString, IsEnum } from 'class-validator';
import { RequestStatus } from 'src/constants/request-status';

export class FilterFriendFilterDTO {}

export class FilterFriendDTO {
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
  @Type(() => FilterFriendFilterDTO)
  filter?: FilterFriendFilterDTO;

  @IsOptional()
  @IsEnum(RequestStatus)
  status?: RequestStatus;

  @IsOptional()
  sort?: string;
}
