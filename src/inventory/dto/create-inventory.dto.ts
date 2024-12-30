import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateInventoryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'La descripcion no puede estar vacio' })
  description: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty({ message: 'La cantidad no puede estar vacia' })
  quantity: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty({ message: 'El precio no puede estar vacio' })
  price: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty({ message: 'El createById no puede estar vacio' })
  createdById: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty({ message: 'El locationId no puede estar vacio' })
  locationId: number;
}
