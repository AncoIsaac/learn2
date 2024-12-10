import { ApiProperty } from '@nestjs/swagger';

export class AssignLocationDto {
  @ApiProperty()
  inventoryId: number;

  @ApiProperty()
  locationId: number;
}
