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
import { PostCommentReplyService } from '../services/post-comment-reply.service';
import { User } from 'src/decorators/user.decorator';
import { Lang } from 'src/decorators/lang.decorator';
import { CreatePostCommentDto } from '../dto/create-post-comment.dto';
import { UpdateCommentReplyDto } from '../dto/update-comment-reply.dto';
import { CreateCommentReplyDto } from '../dto/create-comment-reply.dto';

@UseGuards(JwtAuthGuard)
@Controller('posts/comments')
export class PostCommentReplyController {
  constructor(
    private readonly postCommentReplyService: PostCommentReplyService,
  ) {}

  @Post(':id/replies')
  async createCommentReply(
    @Param('id') uuid: string,
    @Body() body: CreateCommentReplyDto,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } =
      await this.postCommentReplyService.createCommentReply(
        uuid,
        body,
        user,
        lang,
      );
    return { message, data };
  }

  @Get(':id/replies')
  async getCommentReplies(
    @Param('id') uuid: string,
    @Query() query: any,
    @Lang() lang: string,
  ) {
    const { data, total, meta } =
      await this.postCommentReplyService.getCommentReplies(uuid, query, lang);
    return { data, total, meta };
  }

  @Get('replies/:id')
  async getCommentReplyById(@Param('id') uuid: string, @Lang() lang: string) {
    const { data } = await this.postCommentReplyService.getCommentReplyById(
      uuid,
      lang,
    );
    return { data };
  }

  @Patch('replies/:id')
  async updateCommentReply(
    @Param('id') uuid: string,
    @Body() body: UpdateCommentReplyDto,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } =
      await this.postCommentReplyService.updateCommentReply(
        uuid,
        body,
        user,
        lang,
      );
    return { message, data };
  }

  @Delete('replies/:id')
  async deleteCommentReply(
    @Param('id') uuid: string,
    @User() user: any,
    @Lang() lang: string,
  ) {
    const { message, data } =
      await this.postCommentReplyService.deleteCommentReply(uuid, user, lang);
    return { message, data };
  }
}
