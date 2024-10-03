import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  //TODO: use DTO for type
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  //TODO: use DTO for type
  register(@Body() body) {
    return this.authService.register(body.email, body.name, body.password);
  }
}