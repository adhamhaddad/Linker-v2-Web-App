import { Module } from '@nestjs/common';
import { VisitorController } from './controllers/visitor.controller';
import { VisitorService } from './services/visitor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Visitor } from './entities/visitor.entity';
import { User } from '../auth/entities/user.entity';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { Utils } from 'src/utils/utils';
import { RedisService } from '../redis/redis.service';

@Module({
  imports: [TypeOrmModule.forFeature([Visitor, User])],
  providers: [VisitorService, JwtStrategy, Utils, RedisService],
  controllers: [VisitorController],
})
export class VisitorModule {}
