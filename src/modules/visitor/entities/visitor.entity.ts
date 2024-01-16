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
import { IVisitor } from '../interfaces/visitor.interface';
import { User } from 'src/modules/auth/entities/user.entity';

@Entity({ name: 'visitors' })
export class Visitor implements IVisitor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true, nullable: false })
  @Generated('uuid')
  uuid: string;

  @ManyToOne(() => User, (user) => user.visitors)
  @JoinColumn({ name: 'visitor_id' })
  visitor: User;

  @ManyToOne(() => User, (user) => user.recipients)
  @JoinColumn({ name: 'recipient_id' })
  recipient: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updated_at: Date;
}
