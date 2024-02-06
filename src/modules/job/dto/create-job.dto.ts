import { Expose } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Validate,
} from 'class-validator';
import { EmploymentType, LocationType } from '../interfaces/job.interface';

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
  @IsEnum(EmploymentType)
  @Expose({ name: 'employmentType' })
  employment_type: EmploymentType;

  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'location' })
  location: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(LocationType)
  @Expose({ name: 'locationType' })
  location_type: LocationType;

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
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'End date must be in YYYY-MM-DD format',
  })
  @Expose({ name: 'endDate' })
  @Validate(
    (endDate: Date, { object }) => {
      // Custom validation function to check if end date is not before start date
      if (endDate && object && object.start_date) {
        return endDate >= object.start_date;
      }
      return true;
    },
    { message: 'End date must be after or equal to the start date' },
  )
  end_date: Date;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @Expose({ name: 'description' })
  description: string;
}
