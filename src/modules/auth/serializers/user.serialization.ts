import { Exclude, Expose } from 'class-transformer';
import { Gender } from 'src/constants';

export class UserSerialization {
  @Expose({ name: 'uuid' })
  id: number;

  @Expose({ name: 'profile_url' })
  profileUrl: string;

  @Expose({ name: 'first_name' })
  firstName: string;

  @Expose({ name: 'middle_name' })
  middleName: string;

  @Expose({ name: 'last_name' })
  lastName: string;

  @Expose({ name: 'username' })
  username: string;

  @Expose({ name: 'email' })
  email: string;

  @Expose({ name: 'gender' })
  gender: Gender;

  @Expose({ name: 'birth_date' })
  birthDate: string;

  @Exclude()
  password: string;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;
}
