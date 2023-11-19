import { Expose } from 'class-transformer';
import { Gender } from 'src/constants';

export class GetUserSerialization {
  @Expose({ name: 'uuid' })
  id: string;

  @Expose({ name: 'first_name' })
  firstName: string;

  @Expose({ name: 'middle_name' })
  middleName: string;

  @Expose({ name: 'last_name' })
  lastName: string;

  @Expose({ name: 'username' })
  username: string;

  @Expose({ name: 'gender' })
  gender: Gender;

  @Expose({ name: 'email' })
  email: string;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updateAt: Date | null;
}
