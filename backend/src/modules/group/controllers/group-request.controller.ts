import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GroupRequestService } from '../services/group-request.service';
import { User } from 'src/decorators/user.decorator';
import { Lang } from 'src/decorators/lang.decorator';
import { UpdateRequestStatusDto } from '../dto/update-group-status.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard';
import { FilterGroupRequestDTO } from '../dto/filter-group-request.dto';

@UseGuards(JwtAuthGuard)
@Controller('groups')
export class GroupRequestController {
  constructor(private readonly groupRequestService: GroupRequestService) {}

  @Post(':id/group-requests')
  async createGroupRequest(
    @Param('id') uuid: string,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.groupRequestService.createGroupRequest(
      uuid,
      user,
      lang,
    );
    return { message, data };
  }

  @Patch(':groupId/group-requests/:requestId')
  async updateGroupRequest(
    @Param('groupId') groupUuid: string,
    @Param('requestId') requestUuid: string,
    @Body() body: UpdateRequestStatusDto,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.groupRequestService.updateGroupRequest(
      groupUuid,
      requestUuid,
      body,
      user,
      lang,
    );
    return { message, data };
  }

  @Get(':id/group-requests')
  async getGroupRequests(
    @Param('id') uuid: string,
    @Query() query: FilterGroupRequestDTO,
    @User() user,
    @Lang() lang: string,
  ) {
    const { data } = await this.groupRequestService.getGroupRequests(
      uuid,
      query,
      user,
      lang,
    );
    return { data };
  }
}
