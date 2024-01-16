import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard';
import { PostCommentLikeService } from '../services/post-comment-like.service';
import { User } from 'src/decorators/user.decorator';
import { Lang } from 'src/decorators/lang.decorator';

@UseGuards(JwtAuthGuard)
@Controller('posts/comments')
export class PostCommentLikeController {
  constructor(
    private readonly postCommentLikeService: PostCommentLikeService,
  ) {}

  @Post(':id/likes')
  async createCommentLike(
    @Param('id') uuid: string,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } =
      await this.postCommentLikeService.createCommentLike(uuid, user, lang);
    return { message, data };
  }

  @Get(':id/likes')
  async getCommentLikes(@Param('id') uuid: string, @Lang() lang: string) {
    const { data, total } = await this.postCommentLikeService.getCommentLikes(
      uuid,
      lang,
    );
    return { data, total };
  }

  @Delete(':id/likes')
  async deleteCommentLike(
    @Param('id') uuid: string,
    @User() user: any,
    @Lang() lang: string,
  ) {
    const { message, data } =
      await this.postCommentLikeService.deleteCommentLike(uuid, user, lang);
    return { message, data };
  }
}
