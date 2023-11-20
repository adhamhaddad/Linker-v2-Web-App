import { Expose } from 'class-transformer';

export class PhoneSerialization {
  @Expose({ name: 'uuid' })
  id: string;

  @Expose({ name: 'phone' })
  phone: string;

  @Expose({ name: 'phone_verified_at' })
  phoneVerifiedAt: Date;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;
}
