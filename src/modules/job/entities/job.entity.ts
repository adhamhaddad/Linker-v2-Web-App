import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import {
  EmploymentType,
  IJob,
  LocationType,
} from '../interfaces/job.interface';
import { User } from 'src/modules/auth/entities/user.entity';
import { Profile } from 'src/modules/profile/entities/profile.entity';

@Entity({ name: 'jobs' })
export class Job implements IJob {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true, nullable: false })
  @Generated('uuid')
  uuid: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  provider: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  title: string;

  @Column({ type: 'enum', enum: EmploymentType, nullable: false })
  employment_type: EmploymentType;

  @Column({ type: 'varchar', length: 100, nullable: false })
  location: string;

  @Column({ type: 'enum', enum: LocationType, nullable: false })
  location_type: LocationType;

  @Column({ type: 'date', nullable: false })
  start_date: Date;

  @Column({ type: 'date', nullable: true })
  end_date: Date;

  @Column({ type: 'varchar', length: 2000, nullable: true })
  description: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Profile, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updated_at: Date;
}
