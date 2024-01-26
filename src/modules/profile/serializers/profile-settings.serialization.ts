import { Expose } from 'class-transformer';
import { ProfileStatus } from '../interfaces/profile.interface';

export class ProfileSettingsSerialization {
  @Expose({ name: 'posts_status' })
  postsStatus: ProfileStatus;

  @Expose({ name: 'friends_status' })
  friendsStatus: ProfileStatus;

  @Expose({ name: 'pages_status' })
  pagesStatus: ProfileStatus;

  @Expose({ name: 'groups_status' })
  groupsStatus: ProfileStatus;
}
