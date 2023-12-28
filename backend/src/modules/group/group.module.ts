import { Module } from '@nestjs/common';
import { GroupService } from './services/group.service';
import { GroupController } from './controllers/group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { User } from '../auth/entities/user.entity';
import { GroupRequest } from './entities/group-request.entity';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { Utils } from 'src/utils/utils';
import { RedisService } from '../redis/redis.service';
import { GroupMember } from './entities/group-member.entity';
import { GroupRequestController } from './controllers/group-request.controller';
import { GroupRequestService } from './services/group-request.service';
import { GroupMemberService } from './services/group-member.service';
import { GroupMemberController } from './controllers/group-member.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Group, GroupRequest, GroupMember, User])],
  providers: [
    GroupService,
    GroupRequestService,
    GroupMemberService,
    JwtStrategy,
    Utils,
    RedisService,
  ],
  controllers: [GroupController, GroupRequestController, GroupMemberController],
})
export class GroupModule {}
