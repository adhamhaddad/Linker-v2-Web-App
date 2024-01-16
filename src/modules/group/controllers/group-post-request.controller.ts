import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GroupPostRequestService } from '../services/group-post-request.service';
import { User } from 'src/decorators/user.decorator';
import { Lang } from 'src/decorators/lang.decorator';
import { UpdateRequestStatusDto } from '../dto/update-group-status.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard';
import { FilterGroupRequestDTO } from '../dto/filter-group-request.dto';

@UseGuards(JwtAuthGuard)
@Controller('pages')
export class GroupPostRequestController {
  constructor(
    private readonly groupPostRequestService: GroupPostRequestService,
  ) {}

  @Patch(':groupId/post-requests/:requestId')
  async updateGroupPostRequest(
    @Param('groupId') groupUuid: string,
    @Param('requestId') requestUuid: string,
    @Body() body: UpdateRequestStatusDto,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } =
      await this.groupPostRequestService.updateGroupPostRequest(
        groupUuid,
        requestUuid,
        body,
        user,
        lang,
      );
    return { message, data };
  }

  @Get(':id/post-requests')
  async getGroupPostRequests(
    @Param('id') uuid: string,
    @Query() query: FilterGroupRequestDTO,
    @User() user,
    @Lang() lang: string,
  ) {
    const { data } = await this.groupPostRequestService.getGroupPostRequests(
      uuid,
      query,
      user,
      lang,
    );
    return { data };
  }
}
