import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UserActivity } from '../entities/user-activity.entity';
import { UserActivityDTO } from '../dto/activity.dto';
import { ActivityListSerialization } from '../serializers/activity.serialization';
import { plainToClass } from 'class-transformer';
import { User } from '../../auth/entities/user.entity';
import { ErrorMessages } from 'src/interfaces/error-messages.interface';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(UserActivity)
    private readonly userActivityRepository: Repository<UserActivity>,
    private readonly i18nService: I18nService,
  ) {}

  async store(userActivity: UserActivityDTO) {
    const { user_id, login_ip_address, type } = userActivity;
    const description = `${type} from  ip ${login_ip_address} address`;
    const activityCount = await this.activityCheck(user_id);
    if (activityCount == 5) {
      //fetching the last 5 activities
      const activities = await this.userActivityRepository.find({
        where: { user: { id: user_id } },
        take: 5,
      });

      //delete the first activity
      await this.userActivityRepository.delete({
        id: activities.at(0).id,
      });

      const data = await this.userActivityRepository.save({
        id: activities.at(0).id,
        ...userActivity,
        user: { id: user_id },
        description,
      });

      return data;
    } else {
      //store the activity
      const data = await this.userActivityRepository.save({
        ...userActivity,
        user: { id: user_id },
        description,
      });

      return data;
    }
  }

  activityCheck(userId: number) {
    return this.userActivityRepository.count({
      where: {
        user: { id: userId },
      },
    });
  }

  async findByUserId(user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const selector: FindOptionsWhere<UserActivity> = {
      user: { id: user.id },
    };
    const whereClause = selector;

    const [activityLogs, total] = await Promise.all([
      this.userActivityRepository.find({
        where: whereClause,
        order: { created_at: 'DESC' },
        take: 5,
      }),
      this.userActivityRepository.count({
        where: selector,
      }),
    ]);

    return {
      message: '',
      data: activityLogs.map((log) => this.serializeUserActivity(log)),
      total,
    };
  }

  async deleteActivity(uuid: string, user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const activity = await this.userActivityRepository.find({
      where: { uuid, user: { id: user.id } },
    });
    if (!activity)
      throw new HttpException(
        errorMessage.userActivityNotFound,
        HttpStatus.NOT_FOUND,
      );

    const { affected } = await this.userActivityRepository.delete({ uuid });
    if (!affected)
      throw new HttpException(
        errorMessage.failedToDeleteUserActivity,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.userActivityDeletedSuccessfully,
      data: this.serializeUserActivity(activity),
    };
  }

  serializeUserActivity(activity) {
    return plainToClass(ActivityListSerialization, activity, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }
}
