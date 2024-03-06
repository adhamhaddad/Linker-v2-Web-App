import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  Generated,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { UserActivityTypeMessages } from 'src/constants/user-activity-type';
import { IActivity } from '../interfaces/activity.interface';

@Entity({ name: 'user_activities' })
export class UserActivity implements IActivity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true, nullable: false })
  @Generated('uuid')
  uuid: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  login_time: Date;

  @Column({ length: 100 })
  login_ip_address: string;

  @Column({ length: 50, nullable: true })
  device_os: string;

  @Column({ length: 100, nullable: true })
  device_model: string;

  @Column({ nullable: true })
  user_agent: string;

  @Column({ type: 'enum', enum: UserActivityTypeMessages })
  type: UserActivityTypeMessages;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn({ nullable: true })
  updated_at: Date;
}
