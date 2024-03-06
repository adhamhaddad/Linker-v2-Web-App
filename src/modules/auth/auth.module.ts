import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { User } from '../user/entities/user.entity';
import { Utils } from 'src/utils/utils';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserActivity } from '../activity/entities/user-activity.entity';
import { RedisModule } from '../redis/redis.module';
import { jwtFactory } from './config/jwt.config';
import { AuthService } from './services/auth.service';
import { PasswordHash } from 'src/utils/password-hash';
import { ActivityService } from '../activity/services/activity.service';
import { OtpController } from './controllers/otp.controller';
import { Profile } from '../profile/entities/profile.entity';
import { ProfileService } from '../profile/services/profile.service';
import { Setting } from '../settings/entities/setting.entity';
import { SettingService } from '../settings/services/setting.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserActivity, Profile, Setting]),
    PassportModule,
    JwtModule.registerAsync(jwtFactory),
    RedisModule,
  ],
  providers: [
    AuthService,
    ProfileService,
    SettingService,
    ActivityService,
    PasswordHash,
    Utils,
  ],
  controllers: [AuthController, OtpController],
})
export class AuthModule {}
