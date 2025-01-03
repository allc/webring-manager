import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWebsiteDto } from './dto/create-website.dto';
import { UpdateWebsiteDto } from './dto/update-website.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class WebsitesService {
  constructor(private prisma: PrismaService) { }

  async create(user: UserEntity, createWebsiteDto: CreateWebsiteDto) {
    //TODO: possibly make atomic?
    const lastOrdering = await this.findLastOrdering();
    const ordering = Math.ceil(lastOrdering) + 1;
    try {
      return await this.prisma.website.create({
        data: {
          ...createWebsiteDto,
          ordering: ordering,
          approved: false,
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
        owner: {
          select: {
            name: true,
          }
        }
      },
      where: {
        approved: true,
      },
      orderBy: {
        ordering: 'asc',
      },
    });
  }

  findAll() {
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

  async approve(id: number) {
    const ordering = await this.findLastOrdering() + 1;
    return this.prisma.website.update({
      where: {
        id: id,
      },
      data: {
        ordering: ordering,
        approved: true,
        addedAt: new Date(),
      },
    });
  }

  async findNeighboursWithCurrentUrl(currentUrl: string) {
    // find current url ordering
    let currentOrdering = undefined;
    try {
      const currentOrdering_ = await this.prisma.website.findUniqueOrThrow({
        select: {
          ordering: true,
        },
        where: {
          url: currentUrl,
          approved: true,
        },
      });
      currentOrdering = currentOrdering_.ordering;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        throw new BadRequestException('Website with this URL is not in the ring');
      }
      throw e;
    }

    const result = {
      prev: null,
      next: null,
    };

    const totalCount = await this.prisma.website.count({
      where: {
        approved: true,
      },
    });
    // if there are less than 2 websites, there are no neighbours
    if (totalCount < 2) {
      return result;
    }

    const prev = await this.prisma.website.findMany({
      select: {
        id: true,
        url: true,
        title: true,
        description: true,
        addedAt: true,
        owner: {
          select: {
            name: true,
          },
        },
      },
      where: {
        ordering: {
          lt: currentOrdering,
        },
        approved: true,
      },
      orderBy: {
        ordering: 'desc',
      },
    });

    const next = await this.prisma.website.findMany({
      select: {
        id: true,
        url: true,
        title: true,
        description: true,
        addedAt: true,
        owner: {
          select: {
            name: true,
          },
        },
      },
      where: {
        ordering: {
          gt: currentOrdering,
        },
        approved: true,
      },
      orderBy: {
        ordering: 'asc',
      },
    });
    
    if (prev.length > 0) {
      result.prev = prev[0];
    } else {
      result.prev = next[next.length - 1];
    }

    if (next.length > 0) {
      result.next = next[0];
    } else {
      result.next = prev[prev.length - 1];
    }

    return result;
  }

  async findRandomWithCurrentUrl(currentUrl: string) {
    const count = await this.prisma.website.count({
      where: {
        approved: true,
        url: {
          not: currentUrl,
        }
      },
    });
    const random = Math.floor(Math.random() * count);
    const result = await this.prisma.website.findMany({
      select: {
        id: true,
        url: true,
        title: true,
        description: true,
        addedAt: true,
        owner: {
          select: {
            name: true,
          },
        },
      },
      where: {
        approved: true,
        url: {
          not: currentUrl,
        },
      },
      skip: random,
      take: 1,
    });
    if (result.length == 0) {
      return null;
    }
    return result[0];
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
