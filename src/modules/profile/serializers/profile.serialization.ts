import { Expose, Type } from 'class-transformer';
import { ProfileStatus } from '../interfaces/profile.interface';
import { GetUserSerialization } from 'src/modules/user/serializers/get-user.serialization';

export class ProfileSerialization {
  @Expose({ name: 'uuid' })
  id: string;

  @Expose({ name: 'posts_status' })
  postsStatus: ProfileStatus;

  @Expose({ name: 'friends_status' })
  friendsStatus: ProfileStatus;

  @Expose({ name: 'pages_status' })
  pagesStatus: ProfileStatus;

  @Expose({ name: 'groups_status' })
  groupsStatus: ProfileStatus;

  @Type(() => GetUserSerialization)
  @Expose({ name: 'user' })
  user: GetUserSerialization;
}
