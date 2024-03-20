import { Module } from '@nestjs/common';
import { VisitorController } from './controllers/visitor.controller';
import { VisitorService } from './services/visitor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Visitor } from './entities/visitor.entity';
import { UserModule } from '@modules/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Visitor]), UserModule],
  providers: [VisitorService],
  controllers: [VisitorController],
})
export class VisitorModule {}
