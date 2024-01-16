export enum PageStatusType {
  PRIVATE = 'private',
  PUBLIC = 'public',
}
export interface IPage {
  id: number;
  uuid: string;
  profile_url?: string;
  cover_url?: string;
  name: string;
  description: string;
  status: PageStatusType;
  created_at: Date;
  updated_at: Date;
}
