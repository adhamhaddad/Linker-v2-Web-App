import { Module } from '@nestjs/common';
import { AddressService } from './services/address.service';
import { AddressController } from './controllers/address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { Profile } from '@modules/profile/entities/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Address, Profile])],
  providers: [AddressService],
  controllers: [AddressController],
})
export class AddressModule {}
