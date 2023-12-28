import { RequestStatus } from 'src/constants/request-status';

export interface IGroupRequest {
  id: number;
  uuid: string;
  status: RequestStatus;
  created_at: Date;
  updated_at: Date;
}
