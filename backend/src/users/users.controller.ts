import { Controller, Get, Param, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id/websites')
  findWebsites(@Request() req, @Param('id') userId: string) {
    const user = req.user;
    if (user.id !== +userId) {
      throw new ForbiddenException();
    }
    return this.usersService.findWebsites(+userId);
  }
}
