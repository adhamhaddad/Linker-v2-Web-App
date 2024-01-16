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
import { IAddress } from '../interfaces/address.interface';
import { User } from 'src/modules/auth/entities/user.entity';

@Entity({ name: 'addresses' })
export class Address implements IAddress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true, nullable: false })
  @Generated('uuid')
  uuid: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  country: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string;

  @OneToOne(() => User, (user) => user.address, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updated_at: Date;
}
