import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class LoginPersonDto {
  @IsNotEmpty({
    message: 'El nombre no debe estar vacia',
  })
  @MinLength(2)
  @ApiProperty()
  name: string;
}
