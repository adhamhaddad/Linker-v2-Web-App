import { Expose } from 'class-transformer';

export class JobSerialization {
  @Expose({ name: 'uuid' })
  id: string;

  @Expose({ name: 'provider' })
  provider: string;

  @Expose({ name: 'title' })
  title: string;

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
