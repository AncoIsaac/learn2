import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UpdatePersonDto {
  @ApiProperty()
  @IsString()
  name?: string;

  @IsNumber()
  userId?: number;
}
