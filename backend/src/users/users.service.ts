import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(email: string, name: string, pass: string) {
    try {
      return await this.prisma.user.create({
        data: {
          email: email,
          name: name,
          password: pass,
        }
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code == 'P2002') {
          throw new BadRequestException('User with this email already exist');
        }
      }
      throw e;
    }
  }

  findOne(email: string) {
    return this.prisma.user.findUnique({ where: {email: email}})
  }

  countAll() {
    return this.prisma.user.count()
  }

  makeSuperuser(email: string) {
    return this.prisma.user.update({
      where: {
        email: email,
      },
      data: {
        superuser: true,
      },
    })
  }
}
