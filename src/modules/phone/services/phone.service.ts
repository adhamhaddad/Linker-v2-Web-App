import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Phone } from '../entities/phone.entity';
import { Repository } from 'typeorm';
import { CreatePhoneDto } from '../dto/create-phone.dto';
import { User } from 'src/modules/auth/entities/user.entity';
import { plainToClass } from 'class-transformer';
import { PhoneSerialization } from '../serializers/phone.serialization';
import { ErrorMessages } from 'src/interfaces/error-messages.interface';
import { I18nService } from 'nestjs-i18n';
import { VerifyOTPDto } from 'src/modules/auth/dto/verify-otp.dto';
import { Utils } from 'src/utils/utils';

@Injectable()
export class PhoneService {
  constructor(
    @InjectRepository(Phone)
    private readonly phoneRepository: Repository<Phone>,
    private readonly utils: Utils,
    private readonly i18nService: I18nService,
  ) {}

  async createPhone(createPhoneDto: CreatePhoneDto, user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    // Check phone if exist
    const checkPhoneExist = await this.phoneRepository.findOne({
      where: { phone: createPhoneDto.phone },
    });
    if (checkPhoneExist)
      throw new HttpException(errorMessage.phoneExist, HttpStatus.BAD_REQUEST);

    // Check user phones count (maxLength: 2)
    const phoneCount = await this.phoneRepository
      .createQueryBuilder('phones')
      .where('phones.user_id= :userId', { userId: user.id })
      .getCount();
    if (phoneCount === 2)
      throw new HttpException(
        errorMessage.phoneMaxLength,
        HttpStatus.BAD_REQUEST,
      );

    //generating & sending otp
    const otp = await this.utils.sendOtpMessage(
      createPhoneDto.phone,
      'register',
    );

    const phoneCreated = this.phoneRepository.create({
      user: { id: user.id },
      ...createPhoneDto,
    });
    const phone = await this.phoneRepository.save(phoneCreated);

    return {
      message: errorMessage.phoneCreatedSuccessfully,
      data: { ...this.serializePhone(phone), otp },
    };
  }

  async verifyPhone(verifyOtpDto: VerifyOTPDto, user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );
    //phone check
    const { username, otp } = verifyOtpDto;
    const phoneNumber = await this.phoneRepository.findOne({
      where: { phone: username, user: { id: user.id } },
    });
    if (!phoneNumber)
      throw new HttpException(errorMessage.phoneNotFound, HttpStatus.NOT_FOUND);

    //check if phone has already been verified
    if (phoneNumber.phone_verified_at)
      throw new HttpException(
        errorMessage.phoneVerified,
        HttpStatus.BAD_REQUEST,
      );

    const { phone } = phoneNumber;
    const key = `${phone}-register`;

    //check otp integrity
    const data = await this.utils.verifyOTP(key, otp);

    if (!data)
      throw new HttpException(errorMessage.invalidOtp, HttpStatus.BAD_REQUEST);

    let message;
    //update phone information
    const { affected } = await this.phoneRepository.update(
      { phone },
      { phone_verified_at: new Date().toISOString() },
    );
    if (affected == 1) message = errorMessage.verificationSuccessful;
    else message = errorMessage.verificationFailed;
    return {
      message,
      data: this.serializePhone(phone),
    };
  }

  async deletePhoneById(uuid: string, user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const phone = await this.phoneRepository.findOne({
      where: { uuid, user: { id: user.id } },
    });
    if (!phone)
      throw new HttpException(errorMessage.phoneNotFound, HttpStatus.NOT_FOUND);

    const { affected } = await this.phoneRepository.delete(phone.id);
    if (!affected)
      throw new HttpException(
        errorMessage.failedToDeletePhone,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.phoneDeletedSuccessfully,
      data: this.serializePhone(phone),
    };
  }

  serializePhone(phone) {
    return plainToClass(PhoneSerialization, phone, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }
}
