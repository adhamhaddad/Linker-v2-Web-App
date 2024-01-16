import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { About } from '../entities/about.entity';
import { Repository } from 'typeorm';
import { CreateAboutDto } from '../dto/create-about.dto';
import { UpdateAboutDto } from '../dto/update-about.dto';
import { User } from 'src/modules/auth/entities/user.entity';
import { plainToClass } from 'class-transformer';
import { AboutSerialization } from '../serializers/about.serialization';
import { ErrorMessages } from 'src/interfaces/error-messages.interface';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class AboutService {
  constructor(
    @InjectRepository(About)
    private readonly aboutRepository: Repository<About>,
    private readonly i18nService: I18nService,
  ) {}

  async createAbout(createAboutDto: CreateAboutDto, user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const checkAbout = await this.aboutRepository.findOne({
      where: { user_id: user.id },
    });
    if (checkAbout)
      throw new HttpException(errorMessage.aboutExist, HttpStatus.BAD_REQUEST);

    const aboutCreated = this.aboutRepository.create({
      user_id: user.id,
      ...createAboutDto,
    });
    const about = await this.aboutRepository.save(aboutCreated);

    return {
      message: errorMessage.aboutCreatedSuccessfully,
      data: this.serializeAbout(about),
    };
  }

  async updateAbout(
    id: string,
    updateAboutDto: UpdateAboutDto,
    user: any,
    lang: string,
  ) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const about = await this.getAboutById(user, id, lang);
    if (!about)
      throw new HttpException(errorMessage.aboutNotFound, HttpStatus.NOT_FOUND);

    const { affected } = await this.aboutRepository.update(
      {
        uuid: id,
      },
      updateAboutDto,
    );
    if (!affected)
      throw new HttpException(
        errorMessage.failedToUpdateAbout,
        HttpStatus.BAD_REQUEST,
      );

    const updatedAbout = await this.getAboutById(user, id, lang);

    return {
      message: errorMessage.aboutUpdatedSuccessfully,
      data: this.serializeAbout(updatedAbout),
    };
  }

  async getAboutById(user: User, uuid: string, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const about = await this.aboutRepository.findOne({
      where: { uuid, user_id: user.id },
    });
    if (!about)
      throw new HttpException(errorMessage.aboutNotFound, HttpStatus.NOT_FOUND);

    return about;
  }

  serializeAbout(about) {
    return plainToClass(AboutSerialization, about, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }
}
