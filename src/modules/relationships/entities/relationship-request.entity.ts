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
import { IRelationshipRequest } from '../interfaces/relationship-request.interface';
import { User } from 'src/modules/user/entities/user.entity';
import { Relationship } from './relationship.entity';

@Entity({ name: 'relationship_requests' })
export class RelationshipRequest implements IRelationshipRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true, nullable: false })
  @Generated('uuid')
  uuid: string;

  @ManyToOne(() => Relationship, (relation) => relation.relationshipRequest, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'relation_id' })
  relation: Relationship;

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
