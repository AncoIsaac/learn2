import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Put,
  Query,
} from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { JwtAuthGuard } from 'src/auth/jwt/JwtAuthGuard';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { PersonService } from './person.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('persons')
export class PersonsController {
  constructor(private readonly personsService: PersonService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new persons' })
  async create(@Body() createPersonDto: CreatePersonDto) {
    return this.personsService.create(createPersonDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get all persons' })
  async findAll() {
    return this.personsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('accountant')
  @ApiOperation({ summary: 'Get a person by ID' })
  async findOne(@Param('id') id: string) {
    return this.personsService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Update a person by ID' })
  @Roles('admin')
  async update(
    @Param('id') id: string,
    @Body() updatePersonDto: UpdatePersonDto,
  ) {
    return this.personsService.update(+id, updatePersonDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Delete a person by ID' })
  @Roles('admin')
  async remove(@Param('id') id: string) {
    return this.personsService.remove(+id);
  }

  @Delete(':id/location') // Ruta específica para quitar la ubicación
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('accountant')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'La ubicación ha sido quitada de la persona',
  })
  async removeLocationFromPerson(@Param('id') id: string) {
    return this.personsService.removeLocationFromPerson(+id);
  }

  @Get('filter/data')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all persons' })
  async filterPersons(
    @Query('locationIdIsNull') locationIdIsNull: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const filter = { locationIdIsNull: locationIdIsNull === 'true' };
    const pagination = { page, limit };
    return this.personsService.filterPersons(filter, pagination);
  }
}
