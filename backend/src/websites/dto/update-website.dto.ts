import { PartialType } from '@nestjs/swagger';
import { CreateWebsiteDto } from './create-website.dto';

export class UpdateWebsiteDto extends PartialType(CreateWebsiteDto) {}
