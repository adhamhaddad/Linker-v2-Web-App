import type { Gender } from 'src/constants';

export enum OnlineStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
}

export interface IUser {
  id: number;
  uuid: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  username: string;
  gender: Gender;
  email: string;
  password: string;
  salt: string;
  email_verified_at: Date | null;
  is_online: OnlineStatus;
  created_at: Date | null;
  updated_at: Date | null;
  deleted_at: Date | null;
  profile_url?: string;
  profile_id?: string;
}
