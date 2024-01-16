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
import { PageAdminService } from '../services/page-admin.service';
import { User } from 'src/decorators/user.decorator';
import { Lang } from 'src/decorators/lang.decorator';
import { CreatePageAdminDto } from '../dto/create-page-admin.dto';
import { UpdatePageAdminDto } from '../dto/update-page-admin.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard';
import { FilterPageAdminDTO } from '../dto/filter-page-admin.dto';

@UseGuards(JwtAuthGuard)
@Controller('pages')
export class PageAdminController {
  constructor(private readonly pageAdminService: PageAdminService) {}

  @Post(':pageId/admins/:adminId')
  async createPageAdmin(
    @Param('pageId') pageUuid: string,
    @Param('adminId') adminUuid: string,
    @Body() body: CreatePageAdminDto,
    @User() user: any,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.pageAdminService.createPageAdmin(
      pageUuid,
      adminUuid,
      body,
      user,
      lang,
    );
    return { message, data };
  }

  @Get(':id/admins')
  async getPageAdmins(
    @Param('id') uuid: string,
    @Query() query: FilterPageAdminDTO,
    @User() user: any,
    @Lang() lang: string,
  ) {
    const { data } = await this.pageAdminService.getPageAdmins(
      uuid,
      query,
      user,
      lang,
    );
    return { data };
  }

  @Patch(':pageId/admins/:adminId')
  async updatePageAdmin(
    @Param('pageId') pageUuid: string,
    @Param('adminId') adminUuid: string,
    @Body() body: UpdatePageAdminDto,
    @User() user: any,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.pageAdminService.updatePageAdmin(
      pageUuid,
      adminUuid,
      body,
      user,
      lang,
    );
    return { message, data };
  }

  @Delete(':pageId/admins/:adminId')
  async deletePageAdmin(
    @Param('pageId') pageUuid: string,
    @Param('adminId') adminUuid: string,
    @User() user: any,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.pageAdminService.deletePageAdmin(
      pageUuid,
      adminUuid,
      user,
      lang,
    );
    return { message, data };
  }
}
