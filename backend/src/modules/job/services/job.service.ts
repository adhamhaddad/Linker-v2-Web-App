import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from '../entities/job.entity';
import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { CreateJobDto } from '../dto/create-job.dto';
import { UpdateJobDto } from '../dto/update-job.dto';
import { User } from 'src/modules/auth/entities/user.entity';
import { ErrorMessages } from 'src/interfaces/error-messages.interface';
import { JobSerialization } from '../serializers/job.serialization';
import { plainToClass } from 'class-transformer';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly i18nService: I18nService,
  ) {}

  async createJob(createJobDto: CreateJobDto, user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const jobCreated = this.jobRepository.create({
      user_id: user.id,
      ...createJobDto,
    });
    const job = await this.jobRepository.save(jobCreated);
    if (!job)
      throw new HttpException(
        errorMessage.failedToCreateJob,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.jobCreatedSuccessfully,
      data: this.serializeJob({ ...job }),
    };
  }

  async getJobById(uuid: string, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const job = await this.jobRepository.findOne({
      where: { uuid },
    });
    if (!job)
      throw new HttpException(errorMessage.jobNotFound, HttpStatus.NOT_FOUND);

    return {
      message: '',
      data: this.serializeJob(job),
    };
  }

  async getJobsByUserId(uuid: string, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    // Get user
    const user = await this.userRepository.findOne({
      where: { uuid },
    });
    if (!user)
      throw new HttpException(errorMessage.userNotFound, HttpStatus.NOT_FOUND);

    const job = await this.jobRepository.find({
      where: { user_id: user.id },
    });
    if (!job)
      throw new HttpException(errorMessage.jobNotFound, HttpStatus.NOT_FOUND);

    return {
      message: '',
      data: this.serializeJob(job),
    };
  }

  async updateJob(
    uuid: string,
    updateJobDto: UpdateJobDto,
    user: User,
    lang: string,
  ) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const job = await this.jobRepository.find({
      where: { uuid, user_id: user.id },
    });
    if (!job)
      throw new HttpException(errorMessage.jobNotFound, HttpStatus.NOT_FOUND);

    const { affected } = await this.jobRepository.update(
      { uuid },
      updateJobDto,
    );
    if (!affected)
      throw new HttpException(
        errorMessage.failedToUpdateJob,
        HttpStatus.BAD_REQUEST,
      );

    const updatedJob = await this.jobRepository.find({
      where: { uuid },
    });

    return {
      message: errorMessage.jobUpdatedSuccessfully,
      data: this.serializeJob(updatedJob),
    };
  }

  async deleteJob(uuid: string, user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const job = await this.jobRepository.findOne({
      where: { uuid, user_id: user.id },
    });
    if (!job)
      throw new HttpException(errorMessage.jobNotFound, HttpStatus.NOT_FOUND);

    const { affected } = await this.jobRepository.delete({ uuid });
    if (!affected)
      throw new HttpException(
        errorMessage.failedToDeleteJob,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.jobDeletedSuccessfully,
      data: this.serializeJob(job),
    };
  }

  serializeJob(job) {
    return plainToClass(JobSerialization, job, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }
}
