import { Expose } from 'class-transformer';

export class Attachments {
  @Expose({ name: 'imageUrl' })
  imageUrl: string[] | [];

  @Expose({ name: 'videoUrl' })
  videoUrl: string[] | [];

  @Expose({ name: 'fileUrl' })
  fileUrl: string[] | [];

  @Expose({ name: 'audioUrl' })
  audioUrl: string[] | [];
}
