import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { About } from '../entities/about.entity';
import { Repository } from 'typeorm';
import { UpdateAboutDto } from '../dto/update-about.dto';
import { plainToClass } from 'class-transformer';
import { AboutSerialization } from '../serializers/about.serialization';
import { ErrorMessages } from 'src/interfaces/error-messages.interface';
import { I18nService } from 'nestjs-i18n';
import { Profile } from 'src/modules/profile/entities/profile.entity';

@Injectable()
export class AboutService {
  constructor(
    @InjectRepository(About)
    private readonly aboutRepository: Repository<About>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly i18nService: I18nService,
  ) {}

  async updateAbout(
    uuid: string,
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

    const profile = await this.profileRepository.findOne({
      where: { uuid, user: { id: user.id } },
    });
    if (!profile)
      throw new HttpException(
        errorMessage.profileNotFound,
        HttpStatus.BAD_REQUEST,
      );

    const about = await this.aboutRepository.findOne({
      where: {
        profile: { uuid },
        user: { id: user.id },
      },
    });
    if (!about) {
      const aboutCreated = this.aboutRepository.create({
        profile,
        user,
        about: updateAboutDto.about,
      });

      const savedAbout = await this.aboutRepository.save(aboutCreated);
      if (!savedAbout)
        throw new HttpException(
          errorMessage.failedToUpdateAbout,
          HttpStatus.BAD_REQUEST,
        );

      return {
        message: errorMessage.aboutUpdatedSuccessfully,
        data: this.serializeAbout(savedAbout),
      };
    }

    const updatedAbout = await this.aboutRepository.save({
      ...about,
      about: updateAboutDto.about,
    });
    if (!updatedAbout)
      throw new HttpException(
        errorMessage.failedToUpdateAbout,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.aboutUpdatedSuccessfully,
      data: this.serializeAbout(updatedAbout),
    };
  }

  serializeAbout(about) {
    return plainToClass(AboutSerialization, about, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }
}
