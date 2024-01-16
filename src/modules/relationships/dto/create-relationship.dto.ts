import { Expose } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import {
  MultiRelationType,
  SingleRelationshipType,
} from '../interfaces/relationship.interface';

export class CreateRelationshipDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'recipientId' })
  recipient_id: string;

  @IsString()
  @IsEnum(MultiRelationType, {
    groups: ['multi'],
    each: true,
    context: ({ object }) => ({
      enum: object.recipient_id ? MultiRelationType : SingleRelationshipType,
    }),
  })
  relation: MultiRelationType | SingleRelationshipType;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsDateString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Start date must be in YYYY-MM-DD format',
  })
  @Expose({ name: 'startDate' })
  start_date: Date;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsDateString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'End date must be in YYYY-MM-DD format',
  })
  @Expose({ name: 'endDate' })
  end_date: Date;
}
