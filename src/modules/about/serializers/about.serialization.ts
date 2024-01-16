import { Expose } from 'class-transformer';

export class AboutSerialization {
  @Expose({ name: 'uuid' })
  id: string;

  @Expose({ name: 'about' })
  about: string;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;
}
