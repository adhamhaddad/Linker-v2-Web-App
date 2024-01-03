import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Generated,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { IPostCommentReply } from '../interfaces/post-comment-reply.interface';
import { User } from 'src/modules/auth/entities/user.entity';
import { PostComment } from './post-comment.entity';
import { PostCommentReplyLike } from './post-comment-reply-like.entity';

@Entity({ name: 'post_comment_replies' })
export class PostCommentReply implements IPostCommentReply {
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

  @Column({ type: 'varchar', length: 1000, nullable: false })
  reply: string;

  @Column({ type: 'simple-array', nullable: true })
  images: string[];

  @Column({ type: 'simple-array', nullable: true })
  videos: string[];

  @OneToMany(() => PostCommentReplyLike, (like) => like.reply)
  likes: PostCommentReplyLike[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updated_at: Date;
}
