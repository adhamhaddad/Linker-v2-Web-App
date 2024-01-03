import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { User } from './entities/user.entity';
import { Utils } from 'src/utils/utils';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserActivity } from './entities/user-activity.entity';
import { RedisModule } from '../redis/redis.module';
import { jwtFactory } from './config/jwt.config';
import { AuthService } from './services/auth.service';
import { PasswordHash } from 'src/utils/password-hash';
import { ActivityService } from './services/activity.service';
import { OtpController } from './controllers/otp.controller';
import { Profile } from '../profile/entities/profile.entity';
import { ProfileService } from '../profile/services/profile.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserActivity, Profile]),
    PassportModule,
    JwtModule.registerAsync(jwtFactory),
    RedisModule,
  ],
  providers: [
    AuthService,
    User,
    ProfileService,
    ActivityService,
    PasswordHash,
    Utils,
  ],
  controllers: [AuthController, OtpController],
  exports: [
    User,
    TypeOrmModule.forFeature([User, UserActivity]),
    AuthService,
    Utils,
  ],
})
export class AuthModule {}
