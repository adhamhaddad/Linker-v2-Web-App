import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, FindOptionsWhere, Like, Repository } from 'typeorm';
import { UserActivity } from '../entities/user-activity.entity';
import { UserActivityDTO } from '../dto/activity.dto';
import { ActivityListSerialization } from '../serializers/activity.serialization';
import { plainToClass } from 'class-transformer';
import {
  ActivityLogsSortOptions,
  FilterActivityLogsDTO,
} from '../dto/filter-activity-logs.dto';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(UserActivity)
    private readonly userActivityRepository: Repository<UserActivity>,
  ) {}

  async store(userActivity: UserActivityDTO) {
    const { user_id, login_ip_address, type } = userActivity;
    const description = `${type} from  ip ${login_ip_address} address`;
    const activityCount = await this.activityCheck(user_id);

    if (activityCount == 5) {
      //fetching the last 5 activities
      const activities = await this.userActivityRepository.find({
        where: { user_id },
        take: 5,
      });

      //delete the first activity
      await this.userActivityRepository.delete({
        id: activities.at(0).id,
      });

      const data = await this.userActivityRepository.save({
        id: activities.at(0).id,
        ...userActivity,
        description,
      });

      return data;
    } else {
      //store the activity
      const data = await this.userActivityRepository.save({
        ...userActivity,
        description,
      });

      return data;
    }
  }

  activityCheck(userId: number) {
    return this.userActivityRepository.count({
      where: {
        user_id: userId,
      },
    });
  }

  async findAll(filterActivityLogsDTO: FilterActivityLogsDTO) {
    const selector: FindOptionsWhere<UserActivity> = {};
    filterActivityLogsDTO.paginate = filterActivityLogsDTO?.paginate
      ? filterActivityLogsDTO?.paginate
      : 15;
    filterActivityLogsDTO.page = filterActivityLogsDTO?.page
      ? filterActivityLogsDTO?.page
      : 1;
    const skip =
      (filterActivityLogsDTO.page - 1) * filterActivityLogsDTO?.paginate;
    let order: FindOptionsOrder<UserActivity> = {
      created_at: 'DESC',
    };

    //sorting
    if (filterActivityLogsDTO?.sort) {
      const orderDirection = filterActivityLogsDTO.sort.startsWith('-')
        ? 'DESC'
        : 'ASC';
      const orderKey = filterActivityLogsDTO.sort.replace(/^-/, '');
      switch (orderKey) {
        case ActivityLogsSortOptions.DATE:
          order = { created_at: orderDirection };
          break;
      }
    }

    if (filterActivityLogsDTO?.search) {
      const { search } = filterActivityLogsDTO;
      selector.description = Like(`%${search}%`);
    }

    //show only logged user logs if the role is not admin
    const whereClause = selector;

    const [activityLogs, total] = await Promise.all([
      this.userActivityRepository.find({
        where: whereClause,
        order,
        skip: skip,
        take: filterActivityLogsDTO.paginate,
      }),
      this.userActivityRepository.count({
        where: selector,
      }),
    ]);

    return {
      data: activityLogs.map((activity) => {
        return plainToClass(ActivityListSerialization, activity);
      }),
      meta: {
        total,
        currentPage: filterActivityLogsDTO.page,
        eachPage: filterActivityLogsDTO.paginate,
        lastPage: Math.ceil(total / filterActivityLogsDTO.paginate),
      },
    };
  }
}
