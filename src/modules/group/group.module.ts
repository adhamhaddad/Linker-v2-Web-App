import { Module } from '@nestjs/common';
import { GroupService } from './services/group.service';
import { GroupController } from './controllers/group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { GroupRequest } from './entities/group-request.entity';
import { GroupMember } from './entities/group-member.entity';
import { GroupRequestController } from './controllers/group-request.controller';
import { GroupRequestService } from './services/group-request.service';
import { GroupMemberService } from './services/group-member.service';
import { GroupMemberController } from './controllers/group-member.controller';
import { GroupPostRequest } from './entities/group-post-request.entity';
import { GroupPostRequestService } from './services/group-post-request.service';
import { GroupPostRequestController } from './controllers/group-post-request.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Group,
      GroupRequest,
      GroupMember,
      GroupPostRequest,
    ]),
  ],
  providers: [
    GroupService,
    GroupRequestService,
    GroupMemberService,
    GroupPostRequestService,
  ],
  controllers: [
    GroupController,
    GroupRequestController,
    GroupMemberController,
    GroupPostRequestController,
  ],
  exports: [GroupService, GroupMemberService],
})
export class GroupModule {}
