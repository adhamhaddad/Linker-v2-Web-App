import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './config/database.config';
import appConfig from './config/app.config';
import config from './config/config';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import * as path from 'path';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig, config],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    //Localization
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
    UserModule,
    AddressModule,
    AboutModule,
    PhoneModule,
    EducationModule,
    JobModule,
    ProfilePictureModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule {
  constructor(private readonly configService: ConfigService) {}
  configure(consumer: MiddlewareConsumer): void {
    if (this.configService.get('app.nodeEnv') == 'development') {
      consumer.apply(LoggerMiddleware).forRoutes('*');
    }
  }
}
