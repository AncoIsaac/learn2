import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ExcludePasswordInterceptor } from './exclude-password.interceptor';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/JwtAuthGuard';
import { CounterGuard } from 'src/auth/roles/counter.guard';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard, CounterGuard)
  @Roles('admin')
  @UseInterceptors(ExcludePasswordInterceptor)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiCreatedResponse({ description: 'User created successfully' })
  @ApiUnauthorizedResponse({ description: 'User not authorized' })
  async create(@Body() createUserDto: CreateUserDto) {
    const data = await this.usersService.create(createUserDto);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...test } = data;
    return {
      message: 'User created successfully',
      test,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard, CounterGuard)
  @UseInterceptors(ExcludePasswordInterceptor)
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({ description: 'List of users', type: [CreateUserDto] })
  @ApiUnauthorizedResponse({ description: 'User not authorized' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, CounterGuard)
  @UseInterceptors(ExcludePasswordInterceptor)
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiOkResponse({ description: 'User found', type: CreateUserDto })
  @ApiUnauthorizedResponse({ description: 'User not authorized' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, CounterGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiOkResponse({ description: 'User updated successfully' })
  @ApiUnauthorizedResponse({ description: 'User not authorized' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, CounterGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiOkResponse({ description: 'User deleted successfully' })
  @ApiUnauthorizedResponse({ description: 'User not authorized' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
