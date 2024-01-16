import { Expose } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'provider' })
  provider: string;

  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'title' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @IsDateString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Start date must be in YYYY-MM-DD format',
  })
  @Expose({ name: 'startDate' })
  start_date: Date;

  @IsString()
  @IsNotEmpty()
  @IsDateString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'End date must be in YYYY-MM-DD format',
  })
  @Expose({ name: 'endDate' })
  end_date: Date;
}
