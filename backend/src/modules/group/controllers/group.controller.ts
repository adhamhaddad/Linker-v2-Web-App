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
import { GroupService } from '../services/group.service';
import { User } from 'src/decorators/user.decorator';
import { Lang } from 'src/decorators/lang.decorator';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard';
import { FilterGroupDTO } from '../dto/filter-group.dto';

@UseGuards(JwtAuthGuard)
@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  async createGroup(
    @Body() body: CreateGroupDto,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.groupService.createGroup(
      body,
      user,
      lang,
    );
    return { message, data };
  }

  @Get()
  async getGroups(@Query() query: FilterGroupDTO) {
    const { data, total, meta } = await this.groupService.getGroups(query);
    return { data, total, meta };
  }

  @Get(':id')
  async getGroupById(@Param('id') uuid: string, @Lang() lang: string) {
    const { data } = await this.groupService.getGroupById(uuid, lang);
    return { data };
  }

  @Patch(':id')
  async updateGroup(
    @Param('id') uuid: string,
    @Body() body: UpdateGroupDto,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.groupService.updateGroup(
      uuid,
      body,
      user,
      lang,
    );
    return { message, data };
  }

  @Delete(':id')
  async deleteGroup(
    @Param('id') uuid: string,
    @User() user: any,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.groupService.deleteGroup(
      uuid,
      user,
      lang,
    );
    return { message, data };
  }
}
