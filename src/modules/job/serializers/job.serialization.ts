import { Expose } from 'class-transformer';
import { EmploymentType, LocationType } from '../interfaces/job.interface';

export class JobSerialization {
  @Expose({ name: 'uuid' })
  id: string;

  @Expose({ name: 'provider' })
  provider: string;

  @Expose({ name: 'title' })
  title: string;

  @Expose({ name: 'employment_type' })
  employmentType: EmploymentType;

  @Expose({ name: 'location' })
  location: string;

  @Expose({ name: 'location_type' })
  locationType: LocationType;

  @Expose({ name: 'start_date' })
  startDate: Date;

  @Expose({ name: 'end_date' })
  endDate: Date;

  @Expose({ name: 'description' })
  description: string;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;
}
