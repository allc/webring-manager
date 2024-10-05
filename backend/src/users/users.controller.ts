import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id/websites')
  findWebsites(@Param('id') userId: string) {
    return this.usersService.findWebsites(+userId);
  }
}
