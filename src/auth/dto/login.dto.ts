import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

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
  @MinLength(8)
  @ApiProperty()
  password: string;
}
