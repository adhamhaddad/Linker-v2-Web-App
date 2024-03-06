import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { ProfileStatus, IProfile } from '../interfaces/profile.interface';
import { User } from 'src/modules/user/entities/user.entity';
import { ProfilePicture } from 'src/modules/profile-picture/entities/profile-picture.entity';
import { About } from 'src/modules/about/entities/about.entity';
import { CoverPicture } from 'src/modules/cover-picture/entities/cover-picture.entity';
import { Address } from 'src/modules/address/entities/address.entity';
import { Education } from 'src/modules/education/entities/education.entity';
import { Job } from 'src/modules/job/entities/job.entity';

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

  @OneToMany(() => CoverPicture, (picture) => picture.profile)
  coverPicture: CoverPicture;

  @OneToMany(() => ProfilePicture, (picture) => picture.profile)
  profilePicture: ProfilePicture;

  @OneToOne(() => About, (about) => about.profile)
  about: About;

  @OneToOne(() => Address, (address) => address.profile)
  address: Address;

  @OneToMany(() => Education, (education) => education.profile)
  education: Education;

  @OneToMany(() => Job, (job) => job.profile)
  jobs: Job;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updated_at: Date;
}
