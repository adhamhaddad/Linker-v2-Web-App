import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EducationService } from '../services/education.service';
import { CreateEducationDto } from '../dto/create-education.dto';
import { User } from 'src/decorators/user.decorator';
import { Lang } from 'src/decorators/lang.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard';
import { UpdateEducationDto } from '../dto/update-education.dto';
import { FilterEducationDTO } from '../dto/filter-education.dto';

@UseGuards(JwtAuthGuard)
@Controller('users/profiles')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Post(':id/education')
  async createEducation(
    @Param('id') uuid: string,
    @Body() body: CreateEducationDto,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.educationService.createEducation(
      uuid,
      body,
      user,
      lang,
    );
    return { message, data };
  }

  @Get(':id/education')
  async getEducation(
    @Param('id') uuid: string,
    @Query() query: FilterEducationDTO,
    @Lang() lang: string,
  ) {
    const { data, total, meta } = await this.educationService.getEducation(
      uuid,
      query,
      lang,
    );
    return { data, total, meta };
  }

  @Get('education/:id')
  async getEducationById(@Param('id') uuid: string, @Lang() lang: string) {
    const { message, data } = await this.educationService.getEducationById(
      uuid,
      lang,
    );
    return { message, data };
  }

  @Patch('education/:id')
  async updateEducation(
    @Param('id') uuid: string,
    @Body() body: UpdateEducationDto,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.educationService.updateEducation(
      uuid,
      body,
      user,
      lang,
    );
    return { message, data };
  }

  @Delete('education/:id')
  async deleteEducation(
    @Param('id') uuid: string,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.educationService.deleteEducation(
      uuid,
      user,
      lang,
    );
    return { message, data };
  }
}
