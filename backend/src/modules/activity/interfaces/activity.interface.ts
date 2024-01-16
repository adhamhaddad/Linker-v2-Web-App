import { UserActivityTypeMessages } from 'src/constants';

export interface IActivity {
  id: number;
  uuid: string;
  login_time: Date;
  login_ip_address: string;
  device_os: string;
  device_model: string;
  user_agent: string;
  type: UserActivityTypeMessages;
  description: string;
  created_at: Date;
  updated_at: Date;
}
