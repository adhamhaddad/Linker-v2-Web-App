import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RequestStatus } from 'src/constants/request-status';
import { IFriendRequest } from '../interfaces/friend-request.interface';
import { User } from 'src/modules/user/entities/user.entity';

@Entity({ name: 'friend_requests' })
export class FriendRequest implements IFriendRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true, nullable: false })
  @Generated('uuid')
  uuid: string;

  @ManyToOne(() => User)
  requester: User;

  @ManyToOne(() => User)
  recipient: User;

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
