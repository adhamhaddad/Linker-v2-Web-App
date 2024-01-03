import {
  Controller,
  Post,
  Body,
  Patch,
  UseGuards,
  Param,
} from '@nestjs/common';
import { Lang } from 'src/decorators/lang.decorator';
import { AddressService } from '../services/address.service';
import { User } from 'src/decorators/user.decorator';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users/addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  async createAddress(
    @Body() body: CreateAddressDto,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.addressService.createAddress(
      body,
      user,
      lang,
    );
    return { message, data };
  }

  @Patch(':id')
  async updateAddress(
    @Param('id') id: string,
    @Body() body: UpdateAddressDto,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.addressService.updateAddress(
      id,
      body,
      user,
      lang,
    );
    return { message, data };
  }
}
