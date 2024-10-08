import { Controller, Get, Post, Body, Query, UseGuards, Request, NotFoundException, BadRequestException, Delete, Param, ForbiddenException, Patch } from '@nestjs/common';
import { WebsitesService } from './websites.service';
import { CreateWebsiteDto } from './dto/create-website.dto';
import { UpdateWebsiteDto } from './dto/update-website.dto';
import { ApiOkResponse, ApiOperation, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { WebsiteEntity } from './entities/website.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtAnonymousAuthGuard } from 'src/auth/jwt-anonymous.guard';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Controller('websites')
@ApiTags('websites')
export class WebsitesController {
  constructor(private readonly websitesService: WebsitesService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createWebsiteDto: CreateWebsiteDto) {
    return this.websitesService.create(req.user, createWebsiteDto);
  }

  @UseGuards(JwtAnonymousAuthGuard)
  @Get()
  findAll(@Request() req) {
    const user = req.user;
    if (user && user.superuser) {
      return this.websitesService.findAllIncludesOwners();
    } else {
      return this.websitesService.findAllPublic();
    }
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.websitesService.findOne(+id);
  // }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Request() req, @Param('id') id: string, @Body() updateWebsiteDto: UpdateWebsiteDto) {
    const user = req.user;
    if (!user.superuser) {
      const website = await this.websitesService.findOne(+id);
      if (website.ownerId !== user.id) {
        throw new ForbiddenException('You do not have permission to edit this website');
      }
    }
    return this.websitesService.update(+id, updateWebsiteDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    const user = req.user;
    if (!user.superuser) {
      const website = await this.websitesService.findOne(+id);
      if (website.ownerId !== user.id) {
        throw new ForbiddenException('You do not have permission to delete this website');
      }
    }
    return this.websitesService.remove(+id);
  }

  @Get('neighbours')
  @ApiQuery({ name: 'currentUrl', required: false })
  async findNeighbours(@Query('currentUrl') currentUrl?: string) {
    try {
      await this.websitesService.updateRequestedAtWithUrl(currentUrl);
    } catch(e) {
      if (e !instanceof PrismaClientKnownRequestError && e.code !== 'P2025') {
        throw e;
      }
    }
    return this.websitesService.findNeighboursWithCurrentUrl(currentUrl);
  }
}
