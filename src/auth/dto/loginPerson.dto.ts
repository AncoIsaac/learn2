import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginPersonDto {
  @IsNotEmpty({
    message: 'El nombre no debe estar vacia',
  })
  @ApiProperty()
  name: string;
}
