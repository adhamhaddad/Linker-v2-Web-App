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
import {
  GroupUserRole,
  IGroupMember,
} from '../interfaces/group-member.interface';
import { User } from 'src/modules/auth/entities/user.entity';
import { Group } from './group.entity';

@Entity({ name: 'group_members' })
export class GroupMember implements IGroupMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true, nullable: false })
  @Generated('uuid')
  uuid: string;

  @ManyToOne(() => Group)
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'member_id' })
  member: User;

  @Column({
    type: 'enum',
    enum: GroupUserRole,
    default: 'member',
    nullable: false,
  })
  role: GroupUserRole;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updated_at: Date;
}
