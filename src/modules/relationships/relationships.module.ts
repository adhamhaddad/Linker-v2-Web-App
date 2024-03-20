import { Module } from '@nestjs/common';
import { RelationshipService } from './services/relationship.service';
import { RelationshipController } from './controllers/relationships.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Relationship } from './entities/relationship.entity';
import { RelationshipRequestService } from './services/relationship-request.service';
import { RelationshipRequest } from './entities/relationship-request.entity';
import { RelationshipRequestController } from './controllers/relationship-requests.controller';
import { UserModule } from '@modules/user/user.module';
import { FriendsModule } from '@modules/friends/friends.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Relationship, RelationshipRequest]),
    UserModule,
    FriendsModule,
  ],
  providers: [RelationshipService, RelationshipRequestService],
  controllers: [RelationshipController, RelationshipRequestController],
})
export class RelationshipsModule {}
