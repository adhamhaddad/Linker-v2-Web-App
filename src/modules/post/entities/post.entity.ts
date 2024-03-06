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
import {
  IPost,
  PostProviderTypes,
  PostStatus,
} from '../interfaces/post.interface';
import { User } from 'src/modules/user/entities/user.entity';
import { PostLike } from './post-like.entity';
import { PostComment } from './post-comment.entity';

@Entity({ name: 'posts' })
export class Post implements IPost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true, nullable: false })
  @Generated('uuid')
  uuid: string;

  @Column({ type: 'int', nullable: false })
  provider_id: number;

  @Column({ type: 'enum', enum: PostProviderTypes, nullable: false })
  provider_type: PostProviderTypes;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @Column({ type: 'enum', enum: PostStatus, nullable: false })
  status: PostStatus;

  @Column({ type: 'varchar', length: 2000, nullable: true })
  caption: string;

  @Column({ type: 'simple-array', nullable: true })
  images: string[];

  @Column({ type: 'simple-array', nullable: true })
  videos: string[];

  @OneToMany(() => PostLike, (like) => like.post)
  likes: PostLike[];

  @OneToMany(() => PostComment, (comment) => comment.post)
  comments: PostComment[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updated_at: Date;
}
