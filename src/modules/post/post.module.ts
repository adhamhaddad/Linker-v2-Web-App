import { Module } from '@nestjs/common';
import { PostService } from './services/post.service';
import { PostController } from './controllers/post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostLike } from './entities/post-like.entity';
import { PostComment } from './entities/post-comment.entity';
import { PostCommentReply } from './entities/post-comment-reply.entity';
import { PostCommentLike } from './entities/post-comment-like.entity';
import { PostCommentReplyLike } from './entities/post-comment-reply-like.entity';
import { PostCommentLikeService } from './services/post-comment-like.service';
import { PostCommentReplyService } from './services/post-comment-reply.service';
import { PostCommentReplyLikeService } from './services/post-comment-reply-like.service';
import { PostCommentService } from './services/post-comment.service';
import { PostLikeService } from './services/post-like.service';
import { PostCommentController } from './controllers/post-comment.controller';
import { PostLikeController } from './controllers/post-like.controller';
import { PostCommentLikeController } from './controllers/post-comment-like.controller';
import { PostCommentReplyController } from './controllers/post-comment-reply.controller';
import { PostCommentReplyLikeController } from './controllers/post-comment-reply-like.controller';
import { ProfileModule } from '@modules/profile/profile.module';
import { GroupModule } from '@modules/group/group.module';
import { PageModule } from '@modules/page/page.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Post,
      PostLike,
      PostComment,
      PostCommentLike,
      PostCommentReply,
      PostCommentReplyLike,
    ]),
    ProfileModule,
    PageModule,
    GroupModule,
  ],
  providers: [
    PostService,
    PostLikeService,
    PostCommentService,
    PostCommentLikeService,
    PostCommentReplyService,
    PostCommentReplyLikeService,
  ],
  controllers: [
    PostController,
    PostLikeController,
    PostCommentController,
    PostCommentLikeController,
    PostCommentReplyController,
    PostCommentReplyLikeController,
  ],
})
export class PostModule {}
