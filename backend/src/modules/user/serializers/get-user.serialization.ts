import { Expose } from 'class-transformer';

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
}
