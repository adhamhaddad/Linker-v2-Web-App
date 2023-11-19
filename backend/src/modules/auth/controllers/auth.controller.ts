import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpException,
  HttpStatus,
  Ip,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { RegistrationDto } from '../dto/registeration.dto';
import { Lang } from 'src/decorators/lang.decorator';
import { AuthService } from '../services/auth.service';
import { VerifyOTPDto } from '../dto/verify-otp.dto';
import { SendOTPDto } from '../dto/send-otp.dto';
import { Response } from 'express';
import { LoginDto } from '../dto/login.dto';
import { PasswordResetVerifyDto } from '../dto/password-reset-verify.dto';
import { PasswordResetCompleteDto } from '../dto/password-reset-complete.dto';
import { PasswordResetDto } from '../dto/password-reset.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegistrationDto, @Lang() lang: string) {
    const { message, data } = await this.authService.register(body, lang);
    return { message, data };
  }

  @Post('register/verify')
  async verify(@Body() body: VerifyOTPDto, @Lang() lang: string) {
    const { message, data } = await this.authService.verifyRegister(body, lang);
    return { message, data };
  }

  @Post('email/resend')
  async resendOtp(@Body() body: SendOTPDto, @Lang() lang: string) {
    const { message, data } = await this.authService.resendOtp(body, lang);
    return { message, data };
  }

  @Post('login')
  async login(@Body() body: LoginDto, @Lang() lang: string) {
    const { message, data } = await this.authService.login(body, lang);
    return { message, data };
  }

  @Post('login/verify')
  async verifyOTP(
    @Body() body: VerifyOTPDto,
    @Res({ passthrough: true }) response: Response,
    @Headers() headers: any,
    @Ip() ip: string,
    @Lang() lang: string,
  ) {
    const { message, token, data } = await this.authService.verifyLogin(
      body,
      lang,
      headers,
      ip,
    );
    response.cookie('access_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      expires: new Date(Date.now() + 50 * 60 * 1000),
    });

    return { message, data };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() request: Request | any,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { status } = await this.authService.logout(request);
    if (status) {
      response.clearCookie('access_token', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      });
      return { message: 'Logout Successfully' };
    }
    throw new HttpException(
      'Something went wrong',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Post('password-reset')
  async passwordReset(@Body() body: PasswordResetDto, @Lang() lang: string) {
    const { message, data } = await this.authService.getUserByEmail(body, lang);
    return { message, data };
  }

  @Post('password-reset/verify')
  async passwordResetVerify(
    @Body() body: PasswordResetVerifyDto,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.authService.verifyResetPassword(
      body,
      lang,
    );
    return { message, data };
  }

  @Post('password-reset/reset')
  async passwordResetComplete(
    @Body() body: PasswordResetCompleteDto,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.authService.updateUserPassword(
      body,
      lang,
    );
    return { message, data };
  }
}
