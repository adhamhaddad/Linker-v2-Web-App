export enum ProfileStatus {
  PUBLIC = 'public',
  PRIVATE = 'private',
  FRIENDS_ONLY = 'friends only',
}

export interface IProfile {
  id: number;
  uuid: string;
  posts_status: ProfileStatus;
  friends_status: ProfileStatus;
  pages_status: ProfileStatus;
  groups_status: ProfileStatus;
  created_at: Date;
  updated_at: Date;
}
