import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { AssignInventoryDto } from './dto/assign-inventory.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  create(@Body() createInventoryDto: CreateInventoryDto) {
    return this.inventoryService.create(createInventoryDto);
  }

  @Get()
  findAll() {
    return this.inventoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ) {
    return this.inventoryService.update(+id, updateInventoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventoryService.remove(+id);
  }

  // @Post('assign-location')
  // assignLocation(
  //   @Body('inventoryId') inventoryId: number,
  //   @Body('locationId') locationId: number,
  // ) {
  //   return this.inventoryService.assignLocation(inventoryId, locationId);
  // }

  @Post('assign-location-to-person')
  assignLocationToPerson(
    @Body() assignInventoryDto: AssignInventoryDto,
    // @Body('personId') personId: number,
    // @Body('locationId') locationId: number,
  ) {
    return this.inventoryService.assignLocationToPerson(assignInventoryDto);
  }

  @Post('start-inventory-count')
  startInventoryCount(
    @Body('personId') personId: number,
    @Body('inventoryId') inventoryId: number,
  ) {
    return this.inventoryService.startInventoryCount(personId, inventoryId);
  }
}
