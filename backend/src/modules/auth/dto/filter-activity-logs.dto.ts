import { Type } from 'class-transformer';
import { IsOptional, IsNumber, Min, Matches } from 'class-validator';

export enum ActivityLogsSortOptions {
  DATE = 'date',
}

export class FilterActivityLogsDTO {
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
  @Matches(
    new RegExp(`^-?(${Object.values(ActivityLogsSortOptions).join('|')})$`),
    {
      message: `sort must be one of these values: ${Object.values(
        ActivityLogsSortOptions,
      ).join(', ')}. Add a '-' prefix to sort in descending order`,
    },
  )
  sort?: string;

  @IsOptional()
  search?: string;
}
