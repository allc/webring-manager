import { Controller, Get, Post, Body, Query, UseGuards, Request, NotFoundException, BadRequestException, Delete, Param, ForbiddenException, Patch, Res } from '@nestjs/common';
import { WebsitesService } from './websites.service';
import { CreateWebsiteDto } from './dto/create-website.dto';
import { UpdateWebsiteDto } from './dto/update-website.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtAnonymousAuthGuard } from 'src/auth/jwt-anonymous.guard';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UserEntity } from 'src/users/entities/user.entity';
import { Response } from 'express';

@Controller('websites')
@ApiTags('websites')
export class WebsitesController {
  constructor(private readonly websitesService: WebsitesService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  create(@Request() req: {user: UserEntity}, @Body() createWebsiteDto: CreateWebsiteDto) {
    return this.websitesService.create(req.user, createWebsiteDto);
  }

  @UseGuards(JwtAnonymousAuthGuard)
  @Get()
  findAll(@Request() req: {user: UserEntity}) {
    const user = req.user;
    if (user && user.superuser) {
      return this.websitesService.findAll();
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

  @UseGuards(JwtAuthGuard)
  @Post(':id/approve')
  @ApiBearerAuth()
  approve(@Request() req: {user: UserEntity}, @Param('id') id: string) {
    const user = req.user;
    if (!user.superuser) {
      throw new ForbiddenException('You do not have permission to approve websites.');
    }
    return this.websitesService.approve(+id);
  }

  @Get('neighbours')
  async findNeighbours(@Query('current') currentUrl: string) {
    if (!currentUrl) {
      throw new BadRequestException('Must have "current" query parameter');
    }
    try {
      await this.websitesService.updateRequestedAtWithUrl(currentUrl);
    } catch(e) {
      if (e !instanceof PrismaClientKnownRequestError && e.code !== 'P2025') {
        throw e;
      }
    }
    return this.websitesService.findNeighboursWithCurrentUrl(currentUrl);
  }

  @Get('random')
  @ApiQuery({ name: 'current', required: false })
  async redirectRandom(@Res() res: Response, @Query('current') currentUrl: string) {
    try {
      await this.websitesService.updateRequestedAtWithUrl(currentUrl);
    } catch(e) {
      if (e !instanceof PrismaClientKnownRequestError && e.code !== 'P2025') {
        throw e;
      }
    }
    const randomWebsite = await this.websitesService.findRandomWithCurrentUrl(currentUrl);
    if (!randomWebsite) {
      throw new NotFoundException('No other websites in the ring');
    }
    return res.redirect(randomWebsite.url);
  }
}
