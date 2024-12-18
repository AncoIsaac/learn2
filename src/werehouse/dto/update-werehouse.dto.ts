import { ApiProperty } from '@nestjs/swagger';

export class UpdateWerehouseDto {
  @ApiProperty()
  description?: string;

  @ApiProperty()
  quantity?: number;

  @ApiProperty()
  locationId?: number;
}
