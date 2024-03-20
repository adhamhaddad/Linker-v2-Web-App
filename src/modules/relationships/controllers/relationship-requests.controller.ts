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
import { RelationshipRequestService } from '../services/relationship-request.service';
import { User } from 'src/decorators/user.decorator';
import { Lang } from 'src/decorators/lang.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard';
import { UpdateRequestStatusDto } from '../dto/update-relationship-request.dto';
import { FilterRelationRequestDTO } from '../dto/requests-filter.dto';

@UseGuards(JwtAuthGuard)
@Controller('users/relationship-requests')
export class RelationshipRequestController {
  constructor(
    private readonly relationshipRequestService: RelationshipRequestService,
  ) {}

  @Patch(':id')
  async updateRelationshipRequest(
    @Param('id') uuid: string,
    @Body() body: UpdateRequestStatusDto,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } =
      await this.relationshipRequestService.updateRelationshipRequest(
        uuid,
        body,
        user,
        lang,
      );
    return { message, data };
  }

  @Get()
  async getRelationshipRequests(
    @Query() query: FilterRelationRequestDTO,
    @User() user,
  ) {
    const { data, total, meta } =
      await this.relationshipRequestService.getRelationshipRequests(
        query,
        user,
      );
    return { data, total, meta };
  }
}
