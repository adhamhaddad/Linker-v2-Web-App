import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { User } from '../user/entities/user.entity';
import { Utils } from 'src/utils/utils';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from '../redis/redis.module';
import { jwtFactory } from './config/jwt.config';
import { AuthService } from './services/auth.service';
import { PasswordHash } from 'src/utils/password-hash';
import { OtpController } from './controllers/otp.controller';
import { ActivityModule } from '@modules/activity/activity.module';
import { ProfileModule } from '@modules/profile/profile.module';
import { SettingModule } from '@modules/settings/setting.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.registerAsync(jwtFactory),
    RedisModule,
    ActivityModule,
    ProfileModule,
    SettingModule,
  ],
  providers: [AuthService, PasswordHash, Utils],
  controllers: [AuthController, OtpController],
})
export class AuthModule {}
