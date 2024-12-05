import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty({
    message: 'El correo no debe estar vacia',
  })
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty({
    message: 'La contraseña no debe estar vacia',
  })
  @ApiProperty()
  password: string;
}
