import { Expose, Transform } from 'class-transformer';

export class UserSerialization {
  @Expose({ name: 'uuid' })
  id: string;

  @Expose({ name: 'user' })
  @Transform(({ obj }) => {
    return `${obj.first_name} ${obj.last_name}`;
  })
  fullName: string;

  @Expose({ name: 'username' })
  username: string;
}
