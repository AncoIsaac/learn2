// users/dto/update-user.dto.ts

import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  @ApiProperty()
  email?: string;

  @IsString()
  @MinLength(2)
  @IsOptional()
  @ApiProperty()
  name?: string;

  @IsEnum(Role)
  @IsOptional()
  @ApiProperty()
  role?: Role;

  @IsString()
  @MinLength(8)
  @IsOptional()
  @ApiProperty()
  password?: string;
}
