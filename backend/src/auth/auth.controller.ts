import { Body, Controller, Get, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserEntity } from 'src/users/entities/user.entity';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  //TODO: use DTO for type
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('signup')
  //TODO: use DTO for type
  signup(@Body() body) {
    return this.authService.signup(body.email, body.name, body.password);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getUser(@Request() req: {user: UserEntity}) {
    return req.user;
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  changePassword(@Request() req: {user: UserEntity}, @Body() body: ChangePasswordDto) {
    return this.authService.changePassword(req.user, body.oldPassword, body.newPassword);
  }
}
