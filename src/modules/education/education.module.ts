import { Module } from '@nestjs/common';
import { EducationService } from './services/education.service';
import { EducationController } from './controllers/education.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Education } from './entities/education.entity';
import { Profile } from '../profile/entities/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Education, Profile])],
  providers: [EducationService],
  controllers: [EducationController],
})
export class EducationModule {}
