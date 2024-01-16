import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard';
import { PostCommentReplyLikeService } from '../services/post-comment-reply-like.service';
import { User } from 'src/decorators/user.decorator';
import { Lang } from 'src/decorators/lang.decorator';

@UseGuards(JwtAuthGuard)
@Controller('posts/comments/replies')
export class PostCommentReplyLikeController {
  constructor(
    private readonly postCommentReplyLikeService: PostCommentReplyLikeService,
  ) {}

  @Post(':id/likes')
  async createReplyLike(
    @Param('id') uuid: string,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } =
      await this.postCommentReplyLikeService.createReplyLike(uuid, user, lang);
    return { message, data };
  }

  @Get(':id/likes')
  async getReplyLikes(@Param('id') uuid: string, @Lang() lang: string) {
    const { data, total } =
      await this.postCommentReplyLikeService.getReplyLikes(uuid, lang);
    return { data, total };
  }

  @Delete(':id/likes')
  async deleteReplyLike(
    @Param('id') uuid: string,
    @User() user: any,
    @Lang() lang: string,
  ) {
    const { message, data } =
      await this.postCommentReplyLikeService.deleteReplyLike(uuid, user, lang);
    return { message, data };
  }
}
