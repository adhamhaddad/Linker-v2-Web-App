import { Expose, Transform } from 'class-transformer';

export class UserSerialization {
  @Expose({ name: 'uuid' })
  id: string;

  @Expose({ name: 'profilePicture' })
  @Transform(({ obj }) => {
    return obj.profilePicture[0]?.image_url || null;
  })
  profile: string;

  @Expose({ name: 'user' })
  @Transform(({ obj }) => {
    return `${obj.first_name} ${obj.last_name}`;
  })
  fullName: string;

  @Expose({ name: 'username' })
  username: string;
}
