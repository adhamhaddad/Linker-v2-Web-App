import { Module } from '@nestjs/common';
import { ProfileController } from './controllers/profile.controller';
import { ProfileService } from './services/profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { User } from '../user/entities/user.entity';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { Utils } from 'src/utils/utils';
import { RedisService } from '../redis/redis.service';
import { FriendService } from '../friends/services/friend.service';
import { FriendRequestService } from '../friends/services/friend-request.service';
import { Friend } from '../friends/entities/friend.entity';
import { FriendRequest } from '../friends/entities/friend-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Profile, User])],
  providers: [
    ProfileService,
    // FriendService,
    // FriendRequestService,
    JwtStrategy,
    Utils,
    RedisService,
  ],
  controllers: [ProfileController],
  exports: [ProfileService],
})
export class ProfileModule {}
