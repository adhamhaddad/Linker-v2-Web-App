import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SendOTPDto } from '../dto/send-otp.dto';
import { Lang } from 'src/decorators/lang.decorator';

@Controller('otp')
export class OtpController {
  constructor(private readonly authService: AuthService) {}

  @Post('email/resend')
  async resendOtp(@Body() sendOTPDto: SendOTPDto, @Lang() lang: string) {
    const { message, data } = await this.authService.resendOtp(
      sendOTPDto,
      lang,
    );
    return { message, data };
  }
}
