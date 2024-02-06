import { Expose } from 'class-transformer';

export class ProfilePictureSerialization {
  @Expose({ name: 'uuid' })
  id: string;

  @Expose({ name: 'image_url' })
  imageUrl: string;

  @Expose({ name: 'created_at' })
  createdAt: Date;
}
