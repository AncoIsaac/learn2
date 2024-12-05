import { Controller, Get } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from '@prisma/client';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @ApiOperation({ summary: 'get all roles' })
  @ApiOkResponse({ description: 'List of roles', type: [String] })
  getRoles(): Role[] {
    return this.rolesService.getRoles();
  }
}
