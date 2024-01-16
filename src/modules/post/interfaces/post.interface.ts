export enum PostStatus {
  PUBLIC = 'public',
  PRIVATE = 'private',
  PENDING = 'pending',
}
export enum PostProviderTypes {
  PROFILE = 'profile',
  PAGE = 'page',
  GROUP = 'group',
}

export interface IPost {
  id: number;
  uuid: string;
  provider_id: number;
  provider_type: PostProviderTypes;
  status: PostStatus;
  caption: string;
  images: string[] | [];
  videos: string[] | [];
  created_at: Date;
  updated_at: Date;
}
