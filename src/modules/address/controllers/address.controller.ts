import {
  Controller,
  Post,
  Body,
  Patch,
  UseGuards,
  Param,
  Delete,
} from '@nestjs/common';
import { Lang } from 'src/decorators/lang.decorator';
import { AddressService } from '../services/address.service';
import { User } from 'src/decorators/user.decorator';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users/profiles')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post(':id/addresses')
  async createAddress(
    @Param('id') uuid: string,
    @Body() body: CreateAddressDto,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.addressService.createAddress(
      uuid,
      body,
      user,
      lang,
    );
    return { message, data };
  }

  @Patch('addresses/:id')
  async updateAddress(
    @Param('id') uuid: string,
    @Body() body: UpdateAddressDto,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.addressService.updateAddress(
      uuid,
      body,
      user,
      lang,
    );
    return { message, data };
  }

  @Delete('addresses/:id')
  async deleteAddress(
    @Param('id') uuid: string,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.addressService.deleteAddress(
      uuid,
      user,
      lang,
    );
    return { message, data };
  }
}
