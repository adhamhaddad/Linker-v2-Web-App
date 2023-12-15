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
import { RelationshipService } from '../services/relationship.service';
import { Lang } from 'src/decorators/lang.decorator';
import { User } from 'src/decorators/user.decorator';
import { UpdateRelationshipDto } from '../dto/update-relationship.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard';
import { CreateRelationshipDto } from '../dto/create-relationship.dto';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class RelationshipController {
  constructor(private readonly relationshipService: RelationshipService) {}

  @Post('relationships')
  async createRelationship(
    @Body() body: CreateRelationshipDto,
    @User() user: any,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.relationshipService.createRelationship(
      body,
      user,
      lang,
    );
    return { message, data };
  }

  @Get(':id/relationships')
  async getRelationships(@Param('id') uuid: string, @Lang() lang: string) {
    const { message, data, total, meta } =
      await this.relationshipService.getRelationships(uuid, lang);
    return { message, data, total, meta };
  }

  @Patch('relationships/:id')
  async updateRelationship(
    @Param('id') uuid: string,
    @Body() body: UpdateRelationshipDto,
    @User() user: any,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.relationshipService.updateRelationship(
      uuid,
      body,
      user,
      lang,
    );
    return { message, data };
  }

  @Delete('relationships/:id')
  async deleteRelationship(
    @Param('id') uuid: string,
    @User() user: any,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.relationshipService.deleteRelationship(
      uuid,
      user,
      lang,
    );
    return { message, data };
  }
}
