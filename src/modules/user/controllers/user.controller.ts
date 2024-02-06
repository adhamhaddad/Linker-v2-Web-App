import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard';
import { Lang } from 'src/decorators/lang.decorator';
import { FilterUsersDTO } from '../dto/filter-users.dto';
import { User } from 'src/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id/profiles')
  async getUserProfile(@Param('id') id: string, @Lang() lang: string) {
    const { data, message } = await this.userService.findOne(id, lang);
    return { data, message };
  }

  @Get()
  async getUsers(@Query() query: FilterUsersDTO, @User() user: any) {
    const { data, total, meta } = await this.userService.getUsers(query, user);
    return { data, total, meta };
  }
}
