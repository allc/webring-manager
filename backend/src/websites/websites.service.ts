import { Injectable } from '@nestjs/common';
import { CreateWebsiteDto } from './dto/create-website.dto';
import { UpdateWebsiteDto } from './dto/update-website.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WebsitesService {
  constructor(private prisma: PrismaService) {}

  // create(createWebsiteDto: CreateWebsiteDto) {
  //   return this.prisma.website.create({ data: createWebsiteDto });
  // }

  findAll() {
    return this.prisma.website.findMany();
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
