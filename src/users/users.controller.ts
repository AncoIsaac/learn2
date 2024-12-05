import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ExcludePasswordInterceptor } from './exclude-password.interceptor';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(ExcludePasswordInterceptor)
  async create(@Body() createUserDto: CreateUserDto) {
    const data = await this.usersService.create(createUserDto);

    return {
      message: 'Creación de usuario correctamente',
      data,
    };
  }

  @Get()
  @UseInterceptors(ExcludePasswordInterceptor)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseInterceptors(ExcludePasswordInterceptor)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
