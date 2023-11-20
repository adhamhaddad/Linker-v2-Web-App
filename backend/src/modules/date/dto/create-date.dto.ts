import { Expose } from 'class-transformer';

export class CreateDateDto {
  @Expose({ name: 'startDate' })
  start_date: Date;

  @Expose({ name: 'endDate' })
  end_date: Date;
}
