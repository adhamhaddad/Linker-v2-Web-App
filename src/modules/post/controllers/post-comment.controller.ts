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
import { PostCommentService } from '../services/post-comment.service';
import { User } from 'src/decorators/user.decorator';
import { Lang } from 'src/decorators/lang.decorator';
import { CreatePostCommentDto } from '../dto/create-post-comment.dto';
import { UpdatePostCommentDto } from '../dto/update-post-comment.dto';

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostCommentController {
  constructor(private readonly postCommentService: PostCommentService) {}

  @Post(':id/comments')
  async createPostComment(
    @Param('id') uuid: string,
    @Body() body: CreatePostCommentDto,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.postCommentService.createPostComment(
      uuid,
      body,
      user,
      lang,
    );
    return { message, data };
  }

  @Get(':id/comments')
  async getPostComments(
    @Param('id') uuid: string,
    @Query() query: any,
    @Lang() lang: string,
  ) {
    const { data, total, meta } = await this.postCommentService.getPostComments(
      uuid,
      query,
      lang,
    );
    return { data, total, meta };
  }

  @Get('comments/:id')
  async getPostCommentById(@Param('id') uuid: string, @Lang() lang: string) {
    const { data } = await this.postCommentService.getPostCommentById(
      uuid,
      lang,
    );
    return { data };
  }

  @Patch('comments/:id')
  async updatePostComment(
    @Param('id') uuid: string,
    @Body() body: UpdatePostCommentDto,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.postCommentService.updatePostComment(
      uuid,
      body,
      user,
      lang,
    );
    return { message, data };
  }

  @Delete('comments/:id')
  async deletePostComment(
    @Param('id') uuid: string,
    @User() user: any,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.postCommentService.deletePostComment(
      uuid,
      user,
      lang,
    );
    return { message, data };
  }
}
