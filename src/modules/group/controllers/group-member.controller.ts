import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GroupMemberService } from '../services/group-member.service';
import { User } from 'src/decorators/user.decorator';
import { Lang } from 'src/decorators/lang.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('groups')
export class GroupMemberController {
  constructor(private readonly groupMemberService: GroupMemberService) {}

  @Get(':id/group-members')
  async getGroupMembers(
    @Param('id') uuid: string,
    @Query() query: any,
    @User() user: any,
    @Lang() lang: string,
  ) {
    const { data, total, meta } = await this.groupMemberService.getGroupMembers(
      uuid,
      query,
      user,
      lang,
    );
    return { data, total, meta };
  }

  @Patch(':groupId/group-members/:memberId')
  async updateGroupMember(
    @Param('groupId') groupUuid: string,
    @Param('memberId') memberUuid: string,
    @Body() body: any,
    @User() user: any,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.groupMemberService.updateGroupMember(
      groupUuid,
      memberUuid,
      body,
      user,
      lang,
    );
    return { message, data };
  }

  @Delete(':groupId/group-members/:memberId')
  async deleteGroupMember(
    @Param('groupId') groupUuid: string,
    @Param('memberId') memberUuid: string,
    @User() user: any,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.groupMemberService.deleteGroupMember(
      groupUuid,
      memberUuid,
      user,
      lang,
    );
    return { message, data };
  }
}
