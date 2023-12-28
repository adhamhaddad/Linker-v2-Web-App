import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RequestStatus } from 'src/constants/request-status';
import { IGroupRequest } from '../interfaces/group-request.interface';
import { User } from 'src/modules/auth/entities/user.entity';
import { Group } from './group.entity';

@Entity({ name: 'group_requests' })
export class GroupRequest implements IGroupRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true, nullable: false })
  @Generated('uuid')
  uuid: string;

  @ManyToOne(() => Group)
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'requester_id' })
  requester: User;

  @Column({
    type: 'enum',
    enum: RequestStatus,
    default: 'pending',
    nullable: false,
  })
  status: RequestStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updated_at: Date;
}
