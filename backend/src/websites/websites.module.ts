import { Module } from '@nestjs/common';
import { WebsitesService } from './websites.service';
import { WebsitesController } from './websites.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [WebsitesController],
  providers: [WebsitesService],
  imports: [PrismaModule]
})
export class WebsitesModule {}
