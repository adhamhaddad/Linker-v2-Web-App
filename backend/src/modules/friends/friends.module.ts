import { Module } from '@nestjs/common';
import { FriendsService } from './services/friend.service';
import { FriendsController } from './controllers/friend.controller';
import { FriendRequestController } from './controllers/friend-request.controller';
import { FriendRequestService } from './services/friend-request.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from './entities/friend.entity';
import { FriendRequest } from './entities/friend-request.entity';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { Utils } from 'src/utils/utils';
import { RedisService } from '../redis/redis.service';
import { User } from '../auth/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Friend, FriendRequest, User])],
  providers: [
    FriendsService,
    FriendRequestService,
    JwtStrategy,
    Utils,
    RedisService,
  ],
  controllers: [FriendsController, FriendRequestController],
})
export class FriendsModule {}
