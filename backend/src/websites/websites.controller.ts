import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { WebsitesService } from './websites.service';
import { CreateWebsiteDto } from './dto/create-website.dto';
import { UpdateWebsiteDto } from './dto/update-website.dto';
import { ApiOkResponse, ApiOperation, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { WebsiteEntity } from './entities/website.entity';

@Controller('websites')
@ApiTags('websites')
export class WebsitesController {
  constructor(private readonly websitesService: WebsitesService) {}

  // @Post()
  // create(@Body() createWebsiteDto: CreateWebsiteDto) {
  //   return this.websitesService.create(createWebsiteDto);
  // }

  @Get()
  @ApiOperation({ description: 'Websites sorted in order' })
  @ApiOkResponse({ type: WebsiteEntity, isArray: true })
  findAll() {
    return this.websitesService.findAll();
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

  @Get('prev')
  @ApiOkResponse({ type: WebsiteEntity })
  findPrev(@Query('current') currentUrl: string) {
    return this.websitesService.findPrev(currentUrl)
  }

  @Get('next')
  @ApiOkResponse({ type: WebsiteEntity })
  findNext(@Query('current') currentUrl: string) {
    return this.websitesService.findNext(currentUrl)
  }

  @Get('random')
  @ApiQuery({ name: 'exclude', required: false })
  @ApiOkResponse({ type: WebsiteEntity })
  findRandom(@Query('exclude') excludeUrl?: string) {
    return this.websitesService.findRandom(excludeUrl)
  }
}
