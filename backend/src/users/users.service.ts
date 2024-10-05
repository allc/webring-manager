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
          throw new BadRequestException('User with this email already exists');
        }
      }
      throw e;
    }
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({ where: {id: id}})
  }

  findOneWithEmail(email: string) {
    return this.prisma.user.findUnique({ where: {email: email}});
  }

  countAll() {
    return this.prisma.user.count();
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

  findWebsites(userId: number) {
    return this.prisma.website.findMany({
      where: {
        ownerId: userId,
      },
      orderBy: {
        ordering: 'asc',
      }
    })
  }
}
