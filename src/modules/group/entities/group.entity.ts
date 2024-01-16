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
import { GroupStatusType, IGroup } from '../interfaces/group.interface';
import { User } from 'src/modules/auth/entities/user.entity';
import { GroupRequest } from './group-request.entity';
import { GroupMember } from './group-member.entity';

@Entity({ name: 'groups' })
export class Group implements IGroup {
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

  @Column({ type: 'text', nullable: true })
  rules: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  status: GroupStatusType;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @OneToMany(() => GroupRequest, (request) => request.group)
  requests: GroupRequest[];

  @OneToMany(() => GroupMember, (member) => member.group)
  members: GroupMember[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updated_at: Date;
}
