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

@Module({
  imports: [TypeOrmModule.forFeature([Page, PageAdmin, PageFollower, User])],
  providers: [
    PageService,
    PageAdminService,
    PageFollowerService,
    JwtStrategy,
    Utils,
    RedisService,
  ],
  controllers: [PageController, PageAdminController, PageFollowersController],
})
export class PageModule {}
