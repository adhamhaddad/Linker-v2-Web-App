import { Expose } from 'class-transformer';
import { GroupStatus } from '../interfaces/group-details.interface';

export class GroupDetailsSerialization {
  @Expose({ name: '_id' })
  id: string;

  @Expose({ name: 'name' })
  name: string;

  @Expose({ name: 'icon' })
  icon: string;

  @Expose({ name: 'creatorId' })
  creatorId: number;

  @Expose({ name: 'status' })
  status: GroupStatus;
}
