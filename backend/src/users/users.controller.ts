import { Controller, Get, Param, UseGuards, Request, ForbiddenException, Patch, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req) {
    const user = req.user;
    if (user && user.superuser) {
      return this.usersService.findAll();
    } else {
      throw new ForbiddenException();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/websites')
  findWebsites(@Request() req: {user: User}, @Param('id') userId: string) {
    const user = req.user;
    if (user.id !== +userId) {
      throw new ForbiddenException();
    }
    return this.usersService.findWebsites(+userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Request() req, @Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = req.user;
    if (!user.superuser && +id !== user.id) {
      throw new ForbiddenException('You do not have permission to edit this user');
    }
    return this.usersService.update(+id, updateUserDto);
  }
}
