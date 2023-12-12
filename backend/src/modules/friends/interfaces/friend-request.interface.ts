export enum RequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  CANCELED = 'canceled',
}
export class IFriendRequest {
  id: number;
  uuid: string;
  status: RequestStatus;
  created_at: Date;
  updated_at: Date;
}
