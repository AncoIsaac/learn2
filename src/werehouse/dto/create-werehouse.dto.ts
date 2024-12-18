import { ApiProperty } from '@nestjs/swagger';

export class CreateWerehouseDto {
  @ApiProperty()
  description: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  locationId: number;
}
