import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUserWithPassword(email: string, pass: string) {
    const user = await this.userService.findOneWithEmail(email);
    if (user && bcrypt.compareSync(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async validateUserId(userId: number) {
    const user = await this.userService.findOne(userId);
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  //TODO: use DTO for type
  async login(user) {
    const payload = {
      sub: user.id,
    }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }

  async signup(email: string, name: string, pass: string) {
    //TODO: validate email
    const passwordHash = await this.hashPassword(pass);
    let user = await this.userService.create(email, name, passwordHash);
    const userCount = await this.userService.countAll();
    if (userCount == 1) {
      user = await this.userService.makeSuperuser(user.email);
    }
    const { password, ...result } = user;
    return result;
  }

  async hashPassword(pass: string) {
    const passwordHash = bcrypt.hash(pass, 10);
    return passwordHash
  }

  async updateActiveAt(userId: number) {
    await this.userService.updateActiveAt(userId);
  }
}
