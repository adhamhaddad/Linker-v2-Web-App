import { Module } from '@nestjs/common';
import { AboutService } from './services/about.service';
import { AboutController } from './controllers/about.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { About } from './entities/about.entity';
import { Profile } from '../profile/entities/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([About, Profile])],
  providers: [AboutService],
  controllers: [AboutController],
})
export class AboutModule {}
