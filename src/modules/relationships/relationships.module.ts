import { Module } from '@nestjs/common';
import { RelationshipService } from './services/relationship.service';
import { RelationshipController } from './controllers/relationships.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Relationship } from './entities/relationship.entity';
import { RelationshipRequestService } from './services/relationship-request.service';
import { RelationshipRequest } from './entities/relationship-request.entity';
import { RelationshipRequestController } from './controllers/relationship-requests.controller';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { Utils } from 'src/utils/utils';
import { RedisService } from '../redis/redis.service';
import { User } from '../auth/entities/user.entity';
import { Friend } from '../friends/entities/friend.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Relationship, RelationshipRequest, User, Friend]),
  ],
  providers: [
    RelationshipService,
    RelationshipRequestService,
    JwtStrategy,
    Utils,
    RedisService,
  ],
  controllers: [RelationshipController, RelationshipRequestController],
})
export class RelationshipsModule {}
