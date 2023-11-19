import { Expose } from 'class-transformer';
import { Gender } from 'src/constants';

export class UserProfileSerialization {
  @Expose({ name: 'uuid' })
  id: string;

  @Expose({ name: 'first_name' })
  firstName: string;

  @Expose({ name: 'middle_name' })
  middleName: string;

  @Expose({ name: 'last_name' })
  lastName: string;

  @Expose({ name: 'gender' })
  gender: Gender;

  @Expose({ name: 'birth_date' })
  birthDate: Date;

  @Expose({ name: 'email' })
  email: string;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;
}
