import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class JwtAnonymousAuthGuard extends JwtAuthGuard {
  handleRequest(err, user, info) {
    return user;
  }
}
