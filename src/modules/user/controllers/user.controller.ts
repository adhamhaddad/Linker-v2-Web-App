import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard';
import { Lang } from 'src/decorators/lang.decorator';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:id/profile')
  async getUserProfile(@Param('id') id: string, @Lang() lang: string) {
    const { data, message } = await this.userService.findOne(id, lang);
    return { data, message };
  }
}
