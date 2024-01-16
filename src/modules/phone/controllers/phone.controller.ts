import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard';
import { CreatePhoneDto } from '../dto/create-phone.dto';
import { Lang } from 'src/decorators/lang.decorator';
import { User } from 'src/decorators/user.decorator';
import { PhoneService } from '../services/phone.service';
import { VerifyOTPDto } from 'src/modules/auth/dto/verify-otp.dto';

@UseGuards(JwtAuthGuard)
@Controller('users/phones')
export class PhoneController {
  constructor(private readonly phoneService: PhoneService) {}

  @Post('register')
  async createPhone(
    @Body() body: CreatePhoneDto,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.phoneService.createPhone(
      body,
      user,
      lang,
    );
    return { message, data };
  }

  @Post('register/verify')
  async verify(@Body() body: VerifyOTPDto, @User() user, @Lang() lang: string) {
    const { message, data } = await this.phoneService.verifyPhone(
      body,
      user,
      lang,
    );
    return { message, data };
  }

  @Delete('delete/:id')
  async deletePhone(
    @Param('id') uuid: string,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.phoneService.deletePhoneById(
      uuid,
      user,
      lang,
    );
    return { message, data };
  }
}
