import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import {
  IRelationship,
  MultiRelationType,
  SingleRelationshipType,
} from '../interfaces/relationship.interface';
import { User } from 'src/modules/auth/entities/user.entity';
import { RelationshipRequest } from './relationship-request.entity';

@Entity({ name: 'relationships' })
export class Relationship implements IRelationship {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true, nullable: false })
  @Generated('uuid')
  uuid: string;

  @OneToOne(
    () => RelationshipRequest,
    (relationshipRequest) => relationshipRequest.relation,
  )
  relationshipRequest: RelationshipRequest;

  @ManyToOne(() => User, (user) => user.user1Relations)
  @JoinColumn({ name: 'user1_id' })
  user1: User;

  @ManyToOne(() => User, (user) => user.user2Relations)
  @JoinColumn({ name: 'user2_id' })
  user2: User;

  @Column({
    type: 'enum',
    enum: MultiRelationType,
    nullable: false,
  })
  relation: MultiRelationType | SingleRelationshipType;

  @Column({ type: 'boolean', default: false, nullable: false })
  is_verified: boolean;

  @Column({ type: 'date', nullable: true })
  start_date: Date;

  @Column({ type: 'date', nullable: true })
  end_date: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updated_at: Date;
}
