import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JobService } from '../services/job.service';
import { UpdateJobDto } from '../dto/update-job.dto';
import { CreateJobDto } from '../dto/create-job.dto';
import { User } from 'src/decorators/user.decorator';
import { Lang } from 'src/decorators/lang.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post('jobs')
  async createJob(
    @Body() body: CreateJobDto,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.jobService.createJob(body, user, lang);
    return { message, data };
  }

  @Get(':id/jobs')
  async getJobsByUserId(@Param('id') uuid: string, @Lang() lang: string) {
    const { message, data } = await this.jobService.getJobsByUserId(uuid, lang);
    return { message, data };
  }

  @Get('jobs/:id')
  async getJobById(@Param('id') uuid: string, @Lang() lang: string) {
    const { message, data } = await this.jobService.getJobById(uuid, lang);
    return { message, data };
  }

  @Patch('jobs/:id')
  async updateJob(
    @Param('id') uuid: string,
    @Body() body: UpdateJobDto,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.jobService.updateJob(
      uuid,
      body,
      user,
      lang,
    );
    return { message, data };
  }

  @Delete('jobs/:id')
  async deleteJob(
    @Param('id') uuid: string,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.jobService.deleteJob(uuid, user, lang);
    return { message, data };
  }
}
