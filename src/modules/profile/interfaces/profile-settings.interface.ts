import { ProfileStatus } from './profile.interface';

export interface IProfileSettings {
  posts_status: ProfileStatus;
  friends_status: ProfileStatus;
  pages_status: ProfileStatus;
  groups_status: ProfileStatus;
}
