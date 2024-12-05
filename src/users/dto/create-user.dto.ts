import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @MinLength(2)
  @IsOptional()
  @ApiProperty()
  name?: string;

  @IsString()
  @MinLength(8)
  @ApiProperty()
  password: string;

  @IsEnum(Role)
  @IsOptional()
  @ApiProperty()
  role?: Role;
}
export class UserResponseDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @MinLength(2)
  @IsOptional()
  @ApiProperty()
  name?: string;

  @IsEnum(Role)
  @IsOptional()
  @ApiProperty()
  role?: Role;
}
