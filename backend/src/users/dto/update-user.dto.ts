import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
  @ApiProperty({ required: false})
  email: string;

  @ApiProperty({ required: false})
  name: string;
}
