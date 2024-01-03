import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PagePostRequestService } from '../services/page-request.service';
import { User } from 'src/decorators/user.decorator';
import { Lang } from 'src/decorators/lang.decorator';
import { UpdateRequestStatusDto } from '../dto/update-post-request.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard';
import { FilterPageDTO } from '../dto/filter-page.dto';

@UseGuards(JwtAuthGuard)
@Controller('pages')
export class PagePostRequestController {
  constructor(
    private readonly pagePostRequestService: PagePostRequestService,
  ) {}

  @Patch(':pageId/post-requests/:requestId')
  async updateGroupRequest(
    @Param('pageId') pageUuid: string,
    @Param('requestId') requestUuid: string,
    @Body() body: UpdateRequestStatusDto,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } =
      await this.pagePostRequestService.updateGroupRequest(
        pageUuid,
        requestUuid,
        body,
        user,
        lang,
      );
    return { message, data };
  }

  @Get(':id/post-requests')
  async getPagePostRequests(
    @Param('id') uuid: string,
    @Query() query: FilterPageDTO,
    @User() user,
    @Lang() lang: string,
  ) {
    const { data } = await this.pagePostRequestService.getPagePostRequests(
      uuid,
      query,
      user,
      lang,
    );
    return { data };
  }
}
