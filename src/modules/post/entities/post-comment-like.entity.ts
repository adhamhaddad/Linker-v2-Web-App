import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Generated,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { IPostLike } from '../interfaces/post-like.interface';
import { PostComment } from './post-comment.entity';
import { User } from 'src/modules/auth/entities/user.entity';

@Entity({ name: 'post_comment_likes' })
export class PostCommentLike implements IPostLike {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true, nullable: false })
  @Generated('uuid')
  uuid: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => PostComment, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'comment_id' })
  comment: PostComment;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;
}
