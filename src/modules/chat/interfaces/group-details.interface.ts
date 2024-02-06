export enum GroupStatus {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export interface IGroupDetails {
  icon: string | null;
  name: string;
  creatorId: string;
  status: GroupStatus;
}
