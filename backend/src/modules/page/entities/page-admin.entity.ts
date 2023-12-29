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
import { IPageAdmin, PageAdminRole } from '../interfaces/page-admin.interface';
import { User } from 'src/modules/auth/entities/user.entity';
import { Page } from './page.entity';

@Entity({ name: 'page_admins' })
export class PageAdmin implements IPageAdmin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true, nullable: false })
  @Generated('uuid')
  uuid: string;

  @ManyToOne(() => Page)
  @JoinColumn({ name: 'page_id' })
  page: Page;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'admin_id' })
  admin: User;

  @Column({ type: 'enum', enum: PageAdminRole, nullable: false })
  role: PageAdminRole;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updated_at: Date;
}
