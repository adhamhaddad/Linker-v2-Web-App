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
import { PageService } from '../services/page.service';
import { User } from 'src/decorators/user.decorator';
import { Lang } from 'src/decorators/lang.decorator';
import { CreatePageDto } from '../dto/create-page.dto';
import { UpdatePageDto } from '../dto/update-page.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard';
import { FilterPageDTO } from '../dto/filter-page.dto';

@UseGuards(JwtAuthGuard)
@Controller('pages')
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Post()
  async createPage(
    @Body() body: CreatePageDto,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.pageService.createPage(
      body,
      user,
      lang,
    );
    return { message, data };
  }

  @Get()
  async getPages(@Query() query: FilterPageDTO) {
    const { data, total, meta } = await this.pageService.getPages(query);
    return { data, total, meta };
  }

  @Get(':id')
  async getPageById(@Param('id') uuid: string, @Lang() lang: string) {
    const { data } = await this.pageService.getPageById(uuid, lang);
    return { data };
  }

  @Patch(':id')
  async updatePage(
    @Param('id') uuid: string,
    @Body() body: UpdatePageDto,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.pageService.updatePage(
      uuid,
      body,
      user,
      lang,
    );
    return { message, data };
  }

  @Delete(':id')
  async deletePage(
    @Param('id') uuid: string,
    @User() user: any,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.pageService.deletePage(
      uuid,
      user,
      lang,
    );
    return { message, data };
  }
}
