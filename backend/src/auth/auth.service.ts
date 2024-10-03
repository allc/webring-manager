import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.userService.findOne(email);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user) {
    const payload = {
      email: user.email,
      name: user.name,
      superuser: user.superuser,
    }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }

  async register(email: string, name: string, pass: string) {
    let user = await this.userService.create(email, name, pass);
    const userCount = await this.userService.countAll();
    if (userCount == 1) {
      user = await this.userService.makeSuperuser(user.email);
    }
    const { password, ...result } = user;
    return result;
  }
}
