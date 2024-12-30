import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateLocationDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El nombre no puede estar vacio' })
  name: string;
}
