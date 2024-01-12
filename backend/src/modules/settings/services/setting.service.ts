import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Setting } from '../entities/setting.entity';
import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { User } from 'src/modules/auth/entities/user.entity';
import { ErrorMessages } from 'src/interfaces/error-messages.interface';
import { plainToClass } from 'class-transformer';
import { SettingSerialization } from '../serializers/setting.serialization';
import { UpdateSettingsDto } from '../dto/update-settings.dto';

@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
    private readonly i18nService: I18nService,
  ) {}

  async createSettings(user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const settingsCreated = this.settingRepository.create({ user });
    const settings = await this.settingRepository.save(settingsCreated);
    if (!settings)
      throw new HttpException(
        errorMessage.failedToCreateSettings,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.settingsCreatedSuccessfully,
      data: this.serializeSettings(settings),
    };
  }

  async getSettings(user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const settings = await this.settingRepository.findOne({
      where: { user: { id: user.id } },
    });
    if (!settings)
      throw new HttpException(
        errorMessage.settingsNotFound,
        HttpStatus.NOT_FOUND,
      );

    return {
      data: this.serializeSettings(settings),
    };
  }

  async updateSetting(body: UpdateSettingsDto, user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const settings = await this.settingRepository.findOne({
      where: { user: { id: user.id } },
    });
    if (!settings)
      throw new HttpException(
        errorMessage.settingsNotFound,
        HttpStatus.NOT_FOUND,
      );

    const updatedSettings = await this.settingRepository.save(body);
    if (!updatedSettings)
      throw new HttpException(
        errorMessage.failedToUpdateSettings,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.settingsUpdatedSuccessfully,
      data: this.serializeSettings(updatedSettings),
    };
  }

  serializeSettings(settings) {
    return plainToClass(SettingSerialization, settings, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }
}
