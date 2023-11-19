import { Expose } from 'class-transformer';

export class AddressSerialization {
  @Expose({ name: 'uuid' })
  id: string;

  @Expose({ name: 'country' })
  country: string;

  @Expose({ name: 'city' })
  city: string;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;
}
