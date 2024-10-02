import { ApiProperty } from "@nestjs/swagger";

export class CreateWebsiteDto {
  @ApiProperty()
  url: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false})
  description?: string;
}
