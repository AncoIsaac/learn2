import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePersonDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({
    message: 'El nombre no puede estar vacio',
  })
  name: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty({
    message: 'El userId no puede estar vacio',
  })
  userId: number;
}
