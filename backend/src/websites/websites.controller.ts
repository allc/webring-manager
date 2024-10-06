import { Controller, Get, Post, Body, Query, UseGuards, Request, NotFoundException, BadRequestException } from '@nestjs/common';
import { WebsitesService } from './websites.service';
import { CreateWebsiteDto } from './dto/create-website.dto';
import { UpdateWebsiteDto } from './dto/update-website.dto';
import { ApiOkResponse, ApiOperation, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { WebsiteEntity } from './entities/website.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtAnonymousAuthGuard } from 'src/auth/jwt-anonymous.guard';

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

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateWebsiteDto: UpdateWebsiteDto) {
  //   return this.websitesService.update(+id, updateWebsiteDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.websitesService.remove(+id);
  // }

  @Get('neighbours')
  @ApiQuery({ name: 'currentUrl', required: false })
  async findNeighbours(@Query('currentUrl') currentUrl?: string) {
    await this.websitesService.updateRequestedAtWithUrl(currentUrl);
    return this.websitesService.findNeighboursWithCurrentUrl(currentUrl);
  }
}
