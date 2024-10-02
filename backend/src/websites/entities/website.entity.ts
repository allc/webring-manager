import { Website } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";
import { Decimal } from "@prisma/client/runtime/library";

export class WebsiteEntity implements Website {
    id: number;

    @ApiProperty()
    url: string;

    @ApiProperty()
    title: string;

    @ApiProperty({ required: false, nullable: true})
    description: string;

    ordering: Decimal;

    @ApiProperty()
    addedAt: Date;

    requestedAt: Date;

    ownerId: number;
}
