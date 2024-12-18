import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WerehouseService } from './werehouse.service';
import { CreateWerehouseDto } from './dto/create-werehouse.dto';
import { UpdateWerehouseDto } from './dto/update-werehouse.dto';

@Controller('werehouse')
export class WerehouseController {
  constructor(private readonly werehouseService: WerehouseService) {}

  @Post()
  create(@Body() createWerehouseDto: CreateWerehouseDto) {
    return this.werehouseService.create(createWerehouseDto);
  }

  @Get()
  findAll() {
    return this.werehouseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.werehouseService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWerehouseDto: UpdateWerehouseDto) {
    return this.werehouseService.update(+id, updateWerehouseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.werehouseService.remove(+id);
  }
}
