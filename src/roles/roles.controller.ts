import { Controller, Get, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/roles/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/JwtAuthGuard';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { CounterGuard } from 'src/auth/roles/counter.guard';

@ApiBearerAuth()
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard, CounterGuard)
  @ApiOperation({ summary: 'get all roles' })
  @ApiOkResponse({ description: 'User found' })
  @ApiUnauthorizedResponse({ description: 'User not authorized' })
  @ApiOperation({ summary: 'Get all users' })
  getRoles(): Role[] {
    return this.rolesService.getRoles();
  }
}
