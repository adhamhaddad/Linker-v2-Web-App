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
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard';
import { PostService } from '../services/post.service';
import { User } from 'src/decorators/user.decorator';
import { Lang } from 'src/decorators/lang.decorator';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { FilterPostDTO } from '../dto/filter-post.dto';

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async createPost(
    @Body() body: CreatePostDto,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.postService.createPost(
      body,
      user,
      lang,
    );
    return { message, data };
  }

  @Get()
  async getPosts(
    @Query() query: FilterPostDTO,
    @User() user: any,
    @Lang() lang: string,
  ) {
    const { data, total, meta } = await this.postService.getPosts(
      query,
      user,
      lang,
    );
    return { data, total, meta };
  }

  @Get(':id')
  async getPostById(@Param('id') uuid: string, @Lang() lang: string) {
    const { data, meta } = await this.postService.getPostById(uuid, lang);
    return { data, meta };
  }

  @Patch(':id')
  async updatePost(
    @Param('id') uuid: string,
    @Body() body: UpdatePostDto,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.postService.updatePost(
      uuid,
      body,
      user,
      lang,
    );
    return { message, data };
  }

  @Delete(':id')
  async deletePost(
    @Param('id') uuid: string,
    @User() user: any,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.postService.deletePost(
      uuid,
      user,
      lang,
    );
    return { message, data };
  }
}
