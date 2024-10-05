import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateWebsiteDto } from './dto/create-website.dto';
import { UpdateWebsiteDto } from './dto/update-website.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class WebsitesService {
  constructor(private prisma: PrismaService) {}

  async create(user, createWebsiteDto: CreateWebsiteDto) {
    //TODO: possibly make atomic?
    const lastOrdering = await this.findLastOrdering();
    const ordering = Math.ceil(lastOrdering) + 1;
    try {
      return await this.prisma.website.create({
        data: {
          ...createWebsiteDto,
          ordering: ordering,
          owner: {
            connect: {
              id: user.id,
            }
          }
        }
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code == 'P2002') {
          throw new BadRequestException('Website with this URL already exists');
        }
      }
      throw e;
    }
  }

  async findLastOrdering() {
    const result = await this.prisma.website.findMany({
      select: {
        ordering: true,
      },
      orderBy: {
        ordering: 'desc',
      },
      take: 1,
    });
    if (result.length == 0) {
      return 0;
    }
    return +(result[0]['ordering']);
  }

  findAllPublic() {
    return this.prisma.website.findMany({
      select: {
        id: true,
        url: true,
        title: true,
        description: true,
        addedAt: true,
      },
      orderBy: {
        ordering: 'asc',
      },
    });
  }

  findAllIncludesWebsites() {
    return this.prisma.website.findMany({
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            name: true,
          }
        }
      },
      orderBy: {
        ordering: 'asc',
      },
    })
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} website`;
  // }

  // update(id: number, updateWebsiteDto: UpdateWebsiteDto) {
  //   return `This action updates a #${id} website`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} website`;
  // }

  findPrev(currentUrl: string) {
    return this.prisma.website.findUnique({ where: {url: currentUrl}})
  }

  findNext(currentUrl: string) {
    return this.prisma.website.findUnique({ where: {url: currentUrl}})
  }

  findRandom(excludeUrl: string) {
    return this.prisma.website.findFirst()
  }
}
