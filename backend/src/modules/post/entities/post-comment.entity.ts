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
import { IPostComment } from '../interfaces/post-comment.interface';
import { Post } from './post.entity';
import { User } from 'src/modules/auth/entities/user.entity';
import { PostCommentReply } from './post-comment-reply.entity';
import { PostCommentLike } from './post-comment-like.entity';

@Entity({ name: 'post_comments' })
export class PostComment implements IPostComment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true, nullable: false })
  @Generated('uuid')
  uuid: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Post, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @Column({ type: 'varchar', length: 1000, nullable: false })
  comment: string;

  @Column({ type: 'simple-array', nullable: true })
  images: string[];

  @Column({ type: 'simple-array', nullable: true })
  videos: string[];

  @OneToMany(() => PostCommentLike, (like) => like.comment)
  likes: PostCommentLike[];

  @OneToMany(() => PostCommentReply, (reply) => reply.comment)
  replies: PostCommentReply[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updated_at: Date;
}
