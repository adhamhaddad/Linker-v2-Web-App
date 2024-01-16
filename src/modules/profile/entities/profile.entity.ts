import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { ProfileStatus, IProfile } from '../interfaces/profile.interface';
import { User } from 'src/modules/auth/entities/user.entity';

@Entity({ name: 'profiles' })
export class Profile implements IProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true, nullable: false })
  @Generated('uuid')
  uuid: string;

  @OneToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: ProfileStatus,
    default: 'public',
    nullable: false,
  })
  posts_status: ProfileStatus;

  @Column({
    type: 'enum',
    enum: ProfileStatus,
    default: 'public',
    nullable: false,
  })
  friends_status: ProfileStatus;

  @Column({
    type: 'enum',
    enum: ProfileStatus,
    default: 'public',
    nullable: false,
  })
  pages_status: ProfileStatus;

  @Column({
    type: 'enum',
    enum: ProfileStatus,
    default: 'public',
    nullable: false,
  })
  groups_status: ProfileStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updated_at: Date;
}
