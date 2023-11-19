import {
  HttpException,
  HttpStatus,
  Injectable,
  Req,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { ErrorMessages } from 'src/interfaces/error-messages.interface';
import { Utils } from 'src/utils/utils';
import { PasswordHash } from 'src/utils/password-hash';
import * as bcrypt from 'bcrypt';
import { UserSerialization } from '../serializers/user.serialization';
import { plainToClass } from 'class-transformer';
import { VerifyOTPDto } from '../dto/verify-otp.dto';
import { SendOTPDto } from '../dto/send-otp.dto';
import { UserActivityTypeMessages } from 'src/constants';
import { ActivityService } from './activity.service';
import { LoginDto } from '../dto/login.dto';
import { PasswordResetCompleteDto } from '../dto/password-reset-complete.dto';
import { PasswordResetVerifyDto } from '../dto/password-reset-verify.dto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { RegistrationDto } from '../dto/registeration.dto';
import { PasswordResetDto } from '../dto/password-reset.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly passwordHash: PasswordHash,
    private readonly jwtService: JwtService,
    private readonly utils: Utils,
    private readonly userActivityService: ActivityService,
    private readonly i18nService: I18nService,
  ) {}

  async register(body: RegistrationDto, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const { username, email } = body;

    // check if username or email exist
    const [usernameExist, emailExist] = await Promise.all([
      this.userRepository.count({
        where: {
          username,
        },
      }),
      this.userRepository.count({
        where: {
          email,
        },
      }),
    ]);
    if (usernameExist)
      throw new HttpException(errorMessage.usernameTaken, HttpStatus.CONFLICT);

    if (emailExist)
      throw new HttpException(errorMessage.emailTaken, HttpStatus.CONFLICT);

    const salt = this.passwordHash.generateRandomSalt();
    const hashedPassword = await bcrypt.hash(body.password + salt, 10);
    body.salt = salt;
    body.password = hashedPassword;

    //generating & sending otp
    const otp = await this.utils.sendOtpMessage(email, 'register');

    //save user data
    const userSaveInitiate = this.userRepository.create(body);
    const user = await this.userRepository.save(userSaveInitiate);

    return {
      data: { ...this.serializeUser(user), otp },
      message: errorMessage.otpForVerification,
    };
  }

  async verifyRegister(body: VerifyOTPDto, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    //user check
    const { username, otp } = body;
    const user = await this.userRepository.findOne({
      where: [{ email: username }, { username: username }],
    });
    if (!user)
      throw new HttpException(errorMessage.userNotFound, HttpStatus.NOT_FOUND);

    //check if account has already been verified
    if (user.email_verified_at)
      throw new HttpException(
        errorMessage.accountVerified,
        HttpStatus.BAD_REQUEST,
      );

    const { email } = user;
    const key = `${email}-register`;

    //check otp integrity
    const data = await this.utils.verifyOTP(key, otp);

    if (!data)
      throw new HttpException(errorMessage.invalidOtp, HttpStatus.BAD_REQUEST);

    let message;
    //update user information
    const { affected } = await this.userRepository.update(
      { email },
      { email_verified_at: new Date().toISOString() },
    );
    if (affected == 1) message = errorMessage.verificationSuccessful;
    else message = errorMessage.verificationFailed;

    return {
      message,
      data: this.serializeUser(user),
    };
  }

  async login(body: LoginDto, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const { username, password } = body;

    const user = await this.getUser(username, lang);
    if (!user)
      throw new HttpException(
        errorMessage.userNotFound,
        HttpStatus.BAD_REQUEST,
      );

    // check for admin type
    const { salt } = user;

    const isPasswordMatch = await bcrypt.compare(
      password + salt,
      user.password,
    );
    if (!isPasswordMatch) {
      throw new HttpException(
        errorMessage.invalidUsernameOrPassword,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.utils.redisSetValueDuration(
      `${user.email}-loginOtpPasswordVerified`,
      '1',
      120,
    );
    const otp = await this.utils.sendOtpMessage(user.email, 'login');

    if (otp) {
      return {
        message: errorMessage.otpForVerification,
        data: { email: user.email, otp },
      };
    }

    return { message: errorMessage.resendAfter60Seconds };
  }

  async verifyLogin(
    body: VerifyOTPDto,
    lang: string,
    headers?: Headers,
    ip?: string,
  ) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const deviceInfo = headers['deviceInfoHeaders'];
    const deviceUserAgent = deviceInfo
      ? deviceInfo['Device-User-Agent']
      : headers['user-agent'];
    const deviceOs = deviceInfo ? deviceInfo['Device-OS'] : 'Other';
    const deviceIp = deviceInfo ? deviceInfo['Device-IP'] : ip;
    const deviceModel = deviceInfo ? deviceInfo['Device-Model'] : 'Other';

    //user check
    const { username, otp } = body;
    const user = await this.userRepository.findOne({
      where: [{ email: username }, { username: username }],
    });

    if (!user)
      throw new HttpException(errorMessage.userNotFound, HttpStatus.NOT_FOUND);

    const { email } = user;
    const key = `${email}-login`;

    const otpData = await this.utils.verifyOTP(key, otp);

    if (!otpData) {
      throw new HttpException(errorMessage.invalidOtp, HttpStatus.BAD_REQUEST);
    }

    //check otp integrity and verify if user has logged in with credentials
    const isPasswordVerified = await this.utils.checkPasswordVerificationStatus(
      email,
    );

    if (!isPasswordVerified) {
      throw new HttpException(errorMessage.invalidOtp, HttpStatus.BAD_REQUEST);
    }

    const token = await this.jwtService.signAsync({ user });

    //save login activity
    await this.userActivityService.store({
      login_ip_address: deviceIp || ip,
      device_os: deviceOs || '',
      device_model: deviceModel || '',
      user_agent: deviceUserAgent,
      type: UserActivityTypeMessages.LOGIN_SUCCESS,
      user_id: user.id,
    });

    return {
      message: errorMessage.loginSuccessfully,
      token,
      data: this.serializeUser(user),
    };
  }

  async resendOtp(body: SendOTPDto, lang: string) {
    const { username, source } = body;

    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    //user check
    const user = await this.userRepository.findOne({
      where: [{ email: username }, { username: username }],
    });

    if (!user)
      throw new HttpException(errorMessage.userNotFound, HttpStatus.NOT_FOUND);

    const { email } = user;
    const otp = await this.utils.sendOtpMessage(email, source);

    if (otp) {
      return { message: errorMessage.otpForVerification, data: { otp } };
    }

    return { message: errorMessage.resendAfter60Seconds };
  }

  async updateUserPassword(body: PasswordResetCompleteDto, lang: string) {
    const { username, otp, confirm_password, password } = body;

    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );
    const user = await this.getUser(username, lang);
    const { email } = user;

    const key = `${email}-reset-password`;

    if (password !== confirm_password)
      throw new HttpException(
        errorMessage.passwordMismatch,
        HttpStatus.BAD_REQUEST,
      );

    const otpData = await this.utils.verifyOTP(key, otp);
    if (!otpData) {
      throw new HttpException(errorMessage.invalidOtp, HttpStatus.BAD_REQUEST);
    }

    const salt = this.passwordHash.generateRandomSalt();
    const hashedPassword = await bcrypt.hash(password + salt, 10);

    const { affected } = await this.userRepository.update(
      { id: user.id },
      { password: hashedPassword, salt },
    );

    const message =
      affected === 1
        ? errorMessage.requestSuccessful
        : errorMessage.requestFailed;

    return { message, data: this.serializeUser(user) };
  }
  async verifyResetPassword(body: PasswordResetVerifyDto, lang: string) {
    const { username, otp } = body;
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );
    const user = await this.getUser(username, lang);
    const { email } = user;
    const key = `${email}-reset-password`;
    const otpData = await this.utils.verifyOTP(key, otp, false);
    if (!otpData)
      throw new HttpException(errorMessage.invalidOtp, HttpStatus.BAD_REQUEST);

    return { message: '', data: { isValid: true } };
  }

  async getUser(username: string, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :username OR user.username = :username', {
        username,
      })
      .addSelect('user.password')
      .getOne();
    if (!user)
      throw new HttpException(errorMessage.userNotFound, HttpStatus.NOT_FOUND);

    return user;
  }

  async getUserByEmail(passwordResetDto: PasswordResetDto, lang: string) {
    const { username } = passwordResetDto;
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const user = await this.getUser(username, lang);
    if (!user) {
      throw new HttpException(
        errorMessage.invalidUsernameOrPassword,
        HttpStatus.BAD_REQUEST,
      );
    }

    const otp = await this.utils.sendOtpMessage(user.email, 'reset-password');
    if (otp) {
      return {
        message: errorMessage.otpForVerification,
        data: { otp },
      };
    }

    return { message: errorMessage.resendAfter60Seconds };
  }

  @UseGuards(AuthGuard('jwt'))
  async logout(@Req() request: Request) {
    const { access_token } = request.cookies;

    if (access_token) {
      //get all blacklisted tokens
      const blacklistedTokens = await this.utils.redisGetValue(
        'blacklistedTokens',
      );

      //parse blacklisted tokens
      const parsedBlackListedTokens = blacklistedTokens
        ? JSON.parse(blacklistedTokens)
        : [];

      //stringify blacklisted tokens
      const token = JSON.stringify([
        ...parsedBlackListedTokens,
        { token: access_token },
      ]);

      //setting blacklisted to redis
      await this.utils.redisSetValue('blacklistedTokens', token);

      return { status: true, token: access_token };
    }

    return { status: true, token: null };
  }

  serializeUser(user) {
    return plainToClass(UserSerialization, user, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }
}
