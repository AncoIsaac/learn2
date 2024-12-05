import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class RoleDto {
  @ApiProperty({ enum: Role })
  role: Role;
}
