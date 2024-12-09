import { ApiProperty } from '@nestjs/swagger';

export class UpdateInventoryDto {
  @ApiProperty()
  description?: string;

  @ApiProperty()
  quantity?: number;

  @ApiProperty()
  price?: number;
}
