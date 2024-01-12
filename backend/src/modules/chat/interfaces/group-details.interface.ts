export enum GroupStatus {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export interface IGroupDetails {
  icon: string | null;
  name: string;
  creatorId: number;
  status: GroupStatus;
}
