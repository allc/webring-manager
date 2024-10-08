import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateWebsiteDto } from './dto/create-website.dto';
import { UpdateWebsiteDto } from './dto/update-website.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class WebsitesService {
  constructor(private prisma: PrismaService) { }

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

  findAllIncludesOwners() {
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

  findOne(id: number) {
    return this.prisma.website.findUnique({
      where: {
        id: id,
      },
    });
  }

  update(id: number, updateWebsiteDto: UpdateWebsiteDto) {
    return this.prisma.website.update({
      where: {
        id: id,
      },
      data: updateWebsiteDto,
    });
  }

  remove(id: number) {
    return this.prisma.website.delete({
      where: {
        id: id
      }
    });
  }

  async findNeighboursWithCurrentUrl(currentUrl: string) {
    const result = {
      prev: null,
      next: null,
      random: null,
    };

    const totalCount = await this.prisma.website.count();

    let currentOrdering = undefined;
    if (currentUrl) {
      const currentOrdering_ = await this.prisma.website.findMany({
        select: {
          ordering: true,
        },
        where: {
          url: currentUrl,
        },
      });
      if (currentOrdering_.length > 0) {
        // find prev and next
        currentOrdering = currentOrdering_[0].ordering;
      }
    }

    if (totalCount > 1 && currentOrdering) {
      const index = await this.prisma.website.count({
        where: {
          ordering: {
            lt: currentOrdering,
          }
        }
      });

      const prevSkip = index - 1 >= 0 ? index - 1 : totalCount - 1;
      const prev = await this.prisma.website.findMany({
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
        skip: prevSkip,
        take: 1,
      });
      // prev always exists (assuming atomic, though in reality there is a very little chance not)
      result.prev = prev[0];

      const nextSkip = index < totalCount - 1 ? index + 1 : 0;
      const next = await this.prisma.website.findMany({
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
        skip: nextSkip,
        take: 1,
      });
      // next always exists (assuming atomic, though in reality there is a very little chance not)
      result.next = next[0];
    }

    // find random
    const randomSkip = Math.floor(Math.random() * (totalCount - (currentOrdering === undefined? 0 : 1)));
    const websites = await this.prisma.website.findMany({
      select: {
        id: true,
        url: true,
        title: true,
        description: true,
        addedAt: true,
      },
      where: {
        url: {
          not: currentUrl ? currentUrl : undefined,
        },
      },
      skip: randomSkip,
      take: 1,
    });
    if (websites.length > 0) {
      result.random = websites[0];
    }
  
    return result;
  }

  updateRequestedAtWithUrl(url: string) {
    return this.prisma.website.update({
      where: {
        url: url,
      },
      data: {
        requestedAt: new Date(),
      },
    });
  }
}
