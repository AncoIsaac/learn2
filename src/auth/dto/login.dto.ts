import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty({
    message: 'El correo no debe estar vacia',
  })
  email: string;

  @IsString()
  @IsNotEmpty({
    message: 'La contraseña no debe estar vacia',
  })
  password: string;
}
