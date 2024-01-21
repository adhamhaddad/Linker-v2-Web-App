import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { databaseConfig, mongoConfig, appConfig, config } from './config';
import { TypeOrmConfigService } from './database/sql/typeorm-config.service';
import { MongoConfigService } from './database/mongo/mongo-config.service';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';
import { AuthModule } from './modules/auth/auth.module';
import { ActivityModule } from './modules/activity/activity.module';
import { UserModule } from './modules/user/user.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { JwtService } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { RedisModule } from './modules/redis/redis.module';
import { AddressModule } from './modules/address/address.module';
import { AboutModule } from './modules/about/about.module';
import { PhoneModule } from './modules/phone/phone.module';
import { EducationModule } from './modules/education/education.module';
import { JobModule } from './modules/job/job.module';
import { MulterConfig } from './config/multer.config';
import { ProfilePictureModule } from './modules/profile-picture/profile-picture.module';
import { CoverPictureModule } from './modules/cover-picture/cover-picture.module';
import { FriendsModule } from './modules/friends/friends.module';
import { RelationshipsModule } from './modules/relationships/relationships.module';
import { VisitorModule } from './modules/visitor/visitor.module';
import { GroupModule } from './modules/group/group.module';
import { PageModule } from './modules/page/page.module';
import { PostModule } from './modules/post/post.module';
import { ProfileModule } from './modules/profile/profile.module';
import { ChatModule } from './modules/chat/chat.module';
import { SettingModule } from './modules/settings/setting.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, mongoConfig, appConfig, config],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    MongooseModule.forRootAsync({
      useClass: MongoConfigService,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      fallbacks: {
        en: 'en',
        ar: 'ar',
      },
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        includeSubfolders: true,
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),
    MulterConfig,
    ScheduleModule.forRoot(),
    RedisModule,
    AuthModule,
    ActivityModule,
    UserModule,
    ProfileModule,
    AddressModule,
    AboutModule,
    PhoneModule,
    EducationModule,
    JobModule,
    ProfilePictureModule,
    CoverPictureModule,
    FriendsModule,
    RelationshipsModule,
    VisitorModule,
    GroupModule,
    PageModule,
    PostModule,
    ChatModule,
    SettingModule,
  ],
  controllers: [],
  providers: [JwtService],
})
export class AppModule {
  constructor(private readonly configService: ConfigService) {}
  configure(consumer: MiddlewareConsumer): void {
    if (this.configService.get('app.nodeEnv') == 'development') {
      consumer.apply(LoggerMiddleware).forRoutes('*');
    }
  }
}
