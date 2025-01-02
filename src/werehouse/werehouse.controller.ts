import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WerehouseService } from './werehouse.service';
import { CreateWerehouseDto } from './dto/create-werehouse.dto';
import { UpdateWerehouseDto } from './dto/update-werehouse.dto';

@Controller('werehouse')
export class WerehouseController {
  constructor(private readonly werehouseService: WerehouseService) {}

  @Post()
  async create(@Body() createWerehouseDto: CreateWerehouseDto) {
    const createData = await this.werehouseService.create(createWerehouseDto);
    return {
      meesage: 'Werehouse created successfully',
      data: createData,
    };
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
  update(
    @Param('id') id: string,
    @Body() updateWerehouseDto: UpdateWerehouseDto,
  ) {
    return this.werehouseService.update(+id, updateWerehouseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.werehouseService.remove(+id);
  }

  @Get('check-quantity/:locationId')
  async checkSameQuantityInLocation(
    @Param('locationId') locationId: string,
  ): Promise<{
    sameQuantity: boolean;
    counts: {
      [key: string]: {
        quantity: number;
        description: string;
      };
    };
  }> {
    const result = await this.werehouseService.checkSameQuantityInLocation(
      parseInt(locationId),
    );
    return result;
  }
}
