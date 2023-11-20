import { Expose } from 'class-transformer';

export class DateSerialization {
  @Expose({ name: 'uuid' })
  id: string;

  @Expose({ name: 'start_date' })
  startDate: Date;

  @Expose({ name: 'end_date' })
  endDate: Date | null;
}
