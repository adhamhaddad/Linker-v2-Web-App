export enum GroupStatusType {
  PRIVATE = 'private',
  PUBLIC = 'public',
}
export interface IGroup {
  id: number;
  uuid: string;
  profile_url?: string;
  cover_url?: string;
  name: string;
  description: string;
  rules: string;
  status: GroupStatusType;
  created_at: Date;
  updated_at: Date;
}
