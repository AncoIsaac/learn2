import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AssignLocationDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El invetoryId no puede estar vacio ' })
  inventoryId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'El locationId no puede estar vacio ' })
  locationId: number;
}
