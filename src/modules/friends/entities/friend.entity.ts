import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  Generated,
  JoinColumn,
} from 'typeorm';
import { IFriend } from '../interfaces/friend.interface';
import { User } from 'src/modules/user/entities/user.entity';

@Entity({ name: 'friends' })
export class Friend implements IFriend {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true, nullable: false })
  @Generated('uuid')
  uuid: string;

  @ManyToOne(() => User, (user) => user.user1Friends)
  @JoinColumn({ name: 'user1_id' })
  user1: User;

  @ManyToOne(() => User, (user) => user.user2Friends)
  @JoinColumn({ name: 'user2_id' })
  user2: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updated_at: Date;
}
