import {
  HttpException,
  HttpStatus,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomDate } from '../entities/date.entity';
import { Repository } from 'typeorm';
import { CreateDateDto } from '../dto/create-date.dto';
import { UpdateDateDto } from '../dto/update-date.dto';
import { plainToClass } from 'class-transformer';
import { DateSerialization } from '../serializers/date.serialization';
import { ErrorMessages } from 'src/interfaces/error-messages.interface';
import { I18nService } from 'nestjs-i18n';
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard';

@Injectable()
export class DateService {
  constructor(
    @InjectRepository(CustomDate)
    private readonly dateRepository: Repository<CustomDate>,
    private readonly i18nService: I18nService,
  ) {}

  @UseGuards(JwtAuthGuard)
  async createDate(createDateDto: CreateDateDto, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const dateCreated = this.dateRepository.create(createDateDto);
    const date = await this.dateRepository.save(dateCreated);
    if (!date)
      throw new HttpException(
        errorMessage.failedToCreateDate,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.dateCreatedSuccessfully,
      data: this.serializeDate(date),
    };
  }

  @UseGuards(JwtAuthGuard)
  async updateDate(uuid: string, updateDateDto: UpdateDateDto, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const date = await this.dateRepository.findOne({ where: { uuid } });
    if (!date)
      throw new HttpException(errorMessage.dateNotFound, HttpStatus.NOT_FOUND);

    const { affected } = await this.dateRepository.update(
      { uuid },
      updateDateDto,
    );
    if (!affected)
      throw new HttpException(
        errorMessage.failedToUpdateDate,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.dateUpdatedSuccessfully,
      data: this.serializeDate(date),
    };
  }

  serializeDate(date) {
    return plainToClass(DateSerialization, date, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }
}
