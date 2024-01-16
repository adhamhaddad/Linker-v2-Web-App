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
import { PostCommentReply } from './post-comment-reply.entity';
import { User } from 'src/modules/auth/entities/user.entity';

@Entity({ name: 'post_comment_reply_likes' })
export class PostCommentReplyLike implements IPostLike {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true, nullable: false })
  @Generated('uuid')
  uuid: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => PostCommentReply, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reply_id' })
  reply: PostCommentReply;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;
}
