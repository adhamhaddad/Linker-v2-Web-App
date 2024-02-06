import { Expose } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Validate,
} from 'class-validator';

export class CreateEducationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  degree: string;

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

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  @Expose({ name: 'activities' })
  activities: string;
}
