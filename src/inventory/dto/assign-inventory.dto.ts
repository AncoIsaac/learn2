import { ApiProperty } from '@nestjs/swagger';

export class AssignInventoryDto {
  @ApiProperty()
  personId: number;
  @ApiProperty()
  locationId: number;
}
