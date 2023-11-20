import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  DeleteDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { IUser } from '../interfaces/user.interface';
import { Gender } from 'src/constants';
import { Address } from 'src/modules/address/entities/address.entity';
import { About } from 'src/modules/about/entities/about.entity';
import { Phone } from 'src/modules/phone/entities/phone.entity';

@Entity({ name: 'users' })
export class User implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true, nullable: false })
  @Generated('uuid')
  uuid: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  first_name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  middle_name: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  last_name: string;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  username: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  gender: Gender;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 96, nullable: true })
  salt: string;

  @Column({ type: 'timestamp', nullable: true, default: null })
  email_verified_at: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
  deleted_at: Date;

  @OneToOne(() => Address, (address) => address.user)
  address: Address;

  @OneToOne(() => About, (about) => about.user)
  about: About;

  @OneToMany(() => Phone, (phone) => phone.user)
  phone: Phone;
}
