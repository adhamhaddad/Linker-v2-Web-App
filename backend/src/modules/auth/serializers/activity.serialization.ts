import { Exclude, Expose } from 'class-transformer';

export class ActivityListSerialization {
  @Expose({ name: 'id' })
  id: string;

  @Expose({ name: 'type' })
  actionType: string;

  @Expose({ name: 'description' })
  actionDetails: string;

  @Expose({ name: 'login_time' })
  dateTime: string;

  @Expose({ name: 'login_ip_address' })
  ipAddress: string;

  @Expose({ name: 'device_os' })
  deviceOs: string;

  @Expose({ name: 'device_model' })
  deviceModel: number;

  @Exclude()
  user_id: string;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;

  @Expose({ name: 'deleted_at' })
  deletedAt: Date;
}
