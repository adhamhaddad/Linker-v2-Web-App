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
import { User } from '../auth/entities/user.entity';
import { Profile } from '../profile/entities/profile.entity';
import { PostCommentService } from './services/post-comment.service';
import { PostLikeService } from './services/post-like.service';
import { PostCommentController } from './controllers/post-comment.controller';
import { PostLikeController } from './controllers/post-like.controller';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { Utils } from 'src/utils/utils';
import { RedisService } from '../redis/redis.service';
import { Page } from '../page/entities/page.entity';
import { Group } from '../group/entities/group.entity';
import { PageAdminService } from '../page/services/page-admin.service';
import { PageAdmin } from '../page/entities/page-admin.entity';
import { PageService } from '../page/services/page.service';
import { GroupService } from '../group/services/group.service';
import { ProfileService } from '../profile/services/profile.service';
import { GroupMemberService } from '../group/services/group-member.service';
import { GroupMember } from '../group/entities/group-member.entity';
import { PostCommentLikeController } from './controllers/post-comment-like.controller';
import { PostCommentReplyController } from './controllers/post-comment-reply.controller';
import { PostCommentReplyLikeController } from './controllers/post-comment-reply-like.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Post,
      PostLike,
      PostComment,
      PostCommentLike,
      PostCommentReply,
      PostCommentReplyLike,
      User,
      Profile,
      Page,
      PageAdmin,
      Group,
      GroupMember,
    ]),
  ],
  providers: [
    PostService,
    PostLikeService,
    PostCommentService,
    PostCommentLikeService,
    PostCommentReplyService,
    PostCommentReplyLikeService,
    ProfileService,
    PageService,
    PageAdminService,
    GroupService,
    GroupMemberService,
    JwtStrategy,
    Utils,
    RedisService,
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
