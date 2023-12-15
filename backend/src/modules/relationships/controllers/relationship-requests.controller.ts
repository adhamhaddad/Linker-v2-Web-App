import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RelationshipRequestService } from '../services/relationship-request.service';
import { User } from 'src/decorators/user.decorator';
import { Lang } from 'src/decorators/lang.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard';
import { UpdateRequestStatusDto } from '../dto/update-relationship-request.dto';

@UseGuards(JwtAuthGuard)
@Controller('user/relationship-requests')
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
  async getRelationshipRequests(@User() user, @Lang() lang: string) {
    const { message, data } =
      await this.relationshipRequestService.getRelationshipRequests(user, lang);
    return { message, data };
  }

  @Get('sent')
  async getRelationshipRequestsSent(@User() user, @Lang() lang: string) {
    const { message, data } =
      await this.relationshipRequestService.getRelationshipRequests(
        user,
        lang,
        true,
      );
    return { message, data };
  }
}
