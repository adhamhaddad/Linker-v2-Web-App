import { Module } from '@nestjs/common';
import { GroupService } from './services/group.service';
import { GroupController } from './controllers/group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { User } from '../user/entities/user.entity';
import { GroupRequest } from './entities/group-request.entity';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { Utils } from 'src/utils/utils';
import { RedisService } from '../redis/redis.service';
import { GroupMember } from './entities/group-member.entity';
import { GroupRequestController } from './controllers/group-request.controller';
import { GroupRequestService } from './services/group-request.service';
import { GroupMemberService } from './services/group-member.service';
import { GroupMemberController } from './controllers/group-member.controller';
import { GroupPostRequest } from './entities/group-post-request.entity';
import { GroupPostRequestService } from './services/group-post-request.service';
import { Post } from '../post/entities/post.entity';
import { PostService } from '../post/services/post.service';
import { GroupPostRequestController } from './controllers/group-post-request.controller';
import { Profile } from '../profile/entities/profile.entity';
import { ProfileService } from '../profile/services/profile.service';
import { Page } from '../page/entities/page.entity';
import { PageService } from '../page/services/page.service';
import { PageAdmin } from '../page/entities/page-admin.entity';
import { PageAdminService } from '../page/services/page-admin.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Group,
      GroupRequest,
      GroupMember,
      GroupPostRequest,
      User,
      // Profile,
      // Post,
      // Page,
      // PageAdmin,
    ]),
  ],
  providers: [
    GroupService,
    GroupRequestService,
    GroupMemberService,
    GroupPostRequestService,
    // ProfileService,
    // PostService,
    // PageService,
    // PageAdminService,
    JwtStrategy,
    Utils,
    RedisService,
  ],
  controllers: [
    GroupController,
    GroupRequestController,
    GroupMemberController,
    GroupPostRequestController,
  ],
})
export class GroupModule {}
