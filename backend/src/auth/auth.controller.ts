import { Body, Controller, Get, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

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
  getUser(@Request() req) {
    return req.user;
  }
}
