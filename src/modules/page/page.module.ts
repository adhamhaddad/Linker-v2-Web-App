import { Module } from '@nestjs/common';
import { PageService } from './services/page.service';
import { PageController } from './controllers/page.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Page } from './entities/page.entity';
import { User } from '../auth/entities/user.entity';
import { PageAdmin } from './entities/page-admin.entity';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { Utils } from 'src/utils/utils';
import { RedisService } from '../redis/redis.service';
import { PageFollower } from './entities/page-follower.entity';
import { PageAdminController } from './controllers/page-admin.controller';
import { PageAdminService } from './services/page-admin.service';
import { PageFollowerService } from './services/page-follower.service';
import { PageFollowersController } from './controllers/page-follower.controller';
import { PagePostRequestController } from './controllers/page-request.controller';
import { Post } from '../post/entities/post.entity';
import { PostService } from '../post/services/post.service';
import { PagePostRequest } from './entities/page-post-request.entity';
import { PagePostRequestService } from './services/page-request.service';
import { Profile } from '../profile/entities/profile.entity';
import { ProfileService } from '../profile/services/profile.service';
import { Group } from '../group/entities/group.entity';
import { GroupMember } from '../group/entities/group-member.entity';
import { GroupService } from '../group/services/group.service';
import { GroupMemberService } from '../group/services/group-member.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Page,
      PageAdmin,
      PageFollower,
      PagePostRequest,
      User,
      Profile,
      Post,
      Group,
      GroupMember,
    ]),
  ],
  providers: [
    PageService,
    PageAdminService,
    PageFollowerService,
    PagePostRequestService,
    ProfileService,
    PostService,
    GroupService,
    GroupMemberService,
    JwtStrategy,
    Utils,
    RedisService,
  ],
  controllers: [
    PageController,
    PageAdminController,
    PageFollowersController,
    PagePostRequestController,
  ],
})
export class PageModule {}
