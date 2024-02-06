import { RequestStatus } from 'src/constants/request-status';

export interface IFriendRequest {
  id: number;
  uuid: string;
  status: RequestStatus;
  created_at: Date;
  updated_at: Date;
}
