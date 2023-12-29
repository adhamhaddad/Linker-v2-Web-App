import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { PageStatusType, IPage } from '../interfaces/page.interface';
import { User } from 'src/modules/auth/entities/user.entity';
import { PageAdmin } from './page-admin.entity';
import { PageFollower } from './page-follower.entity';

@Entity({ name: 'pages' })
export class Page implements IPage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true, nullable: false })
  @Generated('uuid')
  uuid: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  profile_url: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  cover_url: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  status: PageStatusType;

  @ManyToOne(() => User, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @OneToMany(() => PageAdmin, (admin) => admin.page)
  admins: PageAdmin[];

  @OneToMany(() => PageFollower, (follower) => follower.page)
  followers: PageFollower[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updated_at: Date;
}
