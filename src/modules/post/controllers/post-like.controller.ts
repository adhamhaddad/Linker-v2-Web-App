import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard';
import { PostLikeService } from '../services/post-like.service';
import { User } from 'src/decorators/user.decorator';
import { Lang } from 'src/decorators/lang.decorator';

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostLikeController {
  constructor(private readonly postLikeService: PostLikeService) {}

  @Post(':id/likes')
  async createPostLike(
    @Param('id') uuid: string,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.postLikeService.createPostLike(
      uuid,
      user,
      lang,
    );
    return { message, data };
  }

  @Get(':id/likes')
  async getPostLikes(@Param('id') uuid: string, @Lang() lang: string) {
    const { data, total } = await this.postLikeService.getPostLikes(uuid, lang);
    return { data, total };
  }

  @Delete(':id/likes')
  async deletePostLike(
    @Param('id') uuid: string,
    @User() user: any,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.postLikeService.deletePostLike(
      uuid,
      user,
      lang,
    );
    return { message, data };
  }
}
