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
import {
  ISetting,
  SettingLangType,
  SettingThemeType,
} from '../interfaces/setting.interface';
import { User } from 'src/modules/auth/entities/user.entity';

@Entity({ name: 'settings' })
export class Setting implements ISetting {
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
    enum: SettingLangType,
    default: 'en',
    nullable: false,
  })
  lang: SettingLangType;

  @Column({
    type: 'enum',
    enum: SettingThemeType,
    default: 'light',
    nullable: false,
  })
  theme: SettingThemeType;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updated_at: Date;
}
