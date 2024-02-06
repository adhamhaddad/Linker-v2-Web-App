import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Visitor } from '../entities/visitor.entity';
import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { User } from 'src/modules/auth/entities/user.entity';
import { ErrorMessages } from 'src/interfaces/error-messages.interface';
import { plainToClass } from 'class-transformer';
import { VisitorSerialization } from '../serializers/visitors.serialization';
import { RecipientSerialization } from '../serializers/recipients.serialization';

@Injectable()
export class VisitorService {
  constructor(
    @InjectRepository(Visitor)
    private readonly visitorRepository: Repository<Visitor>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly i18nService: I18nService,
  ) {}

  async createVisit(uuid: string, user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    // Check if the recipientUuid is the same as the user's UUID
    if (uuid === user.uuid) {
      throw new HttpException(
        errorMessage.cannotVisitYourself,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Check the uuid of user
    const recipient = await this.userRepository.findOne({ where: { uuid } });
    if (!recipient)
      throw new HttpException(errorMessage.userNotFound, HttpStatus.NOT_FOUND);

    // Get Last record using timestamp (created_at)
    const lastVisit = await this.visitorRepository.findOne({
      where: { visitor: { id: user.id }, recipient: { id: recipient.id } },
      relations: ['recipient'],
      order: { created_at: 'DESC' },
    });
    const currentDate = new Date();

    // Check if 24h passed to create a new record
    const isSameDay = (date1: Date, date2: Date): boolean => {
      return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
      );
    };
    if (!lastVisit || !isSameDay(lastVisit.created_at, currentDate)) {
      // Create a new record
      const visitCreated = this.visitorRepository.create({
        visitor: user,
        recipient: recipient,
      });
      const visit = await this.visitorRepository.save(visitCreated);
      if (!visit)
        throw new HttpException(
          errorMessage.failedToCreateVisit,
          HttpStatus.BAD_REQUEST,
        );

      return {
        message: errorMessage.visitCreatedSuccessfully,
        data: this.serializeRecipients(visit),
      };
    }

    // Update the (updated_at) date
    lastVisit.updated_at = new Date();
    const updatedVisit = await this.visitorRepository.save(lastVisit);
    if (!updatedVisit)
      throw new HttpException(
        errorMessage.failedToUpdateVisit,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.visitUpdatedSuccessfully,
      data: this.serializeRecipients(updatedVisit),
    };
  }

  async getVisits(uuid: string, user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const visits = await this.visitorRepository.find({
      where: { recipient: { id: user.id } },
      relations: ['visitor'],
    });

    return {
      message: 'Visits received successfully',
      data: visits.map((visitor) => this.serializeVisitors(visitor)),
      total: visits.length,
      meta: { total: visits.length },
    };
  }
  serializeRecipients(recipient) {
    return plainToClass(RecipientSerialization, recipient, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }
  serializeVisitors(visitor) {
    return plainToClass(VisitorSerialization, visitor, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }
}
