import { Module } from '@nestjs/common';
import { PageService } from './services/page.service';
import { PageController } from './controllers/page.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Page } from './entities/page.entity';
import { PageAdmin } from './entities/page-admin.entity';
import { PageFollower } from './entities/page-follower.entity';
import { PageAdminController } from './controllers/page-admin.controller';
import { PageAdminService } from './services/page-admin.service';
import { PageFollowerService } from './services/page-follower.service';
import { PageFollowersController } from './controllers/page-follower.controller';
import { PagePostRequestController } from './controllers/page-request.controller';
import { PagePostRequest } from './entities/page-post-request.entity';
import { PagePostRequestService } from './services/page-request.service';
import { UserModule } from '@modules/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Page, PageAdmin, PageFollower, PagePostRequest]),
    UserModule,
  ],
  providers: [
    PageService,
    PageAdminService,
    PageFollowerService,
    PagePostRequestService,
  ],
  controllers: [
    PageController,
    PageAdminController,
    PageFollowersController,
    PagePostRequestController,
  ],
  exports: [PageService, PageAdminService],
})
export class PageModule {}
