import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { PrismaService } from 'prisma/prismaService/prisma.service';
import { Inventory } from '@prisma/client';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async create(createInventoryDto: CreateInventoryDto): Promise<Inventory> {
    return this.prisma.inventory.create({
      data: createInventoryDto,
    });
  }

  async findAll(): Promise<Inventory[]> {
    return this.prisma.inventory.findMany();
  }

  async findOne(id: number): Promise<Inventory | null> {
    const invetory = await this.prisma.inventory.findUnique({
      where: { id },
    });

    if (!invetory) {
      throw new NotFoundException(`invnetory with ID ${id} not found`);
    }

    return invetory;
  }

  async update(
    id: number,
    updateInventoryDto: UpdateInventoryDto,
  ): Promise<Inventory> {
    const inventory = this.prisma.inventory.findUnique({
      where: { id },
    });

    if (!inventory) {
      throw new NotFoundException(`Inventory with ID ${id} not found`);
    }
    return this.prisma.inventory.update({
      where: { id },
      data: updateInventoryDto,
    });
  }

  async remove(id: number): Promise<Inventory> {
    const inventory = await this.prisma.inventory.findUnique({
      where: { id },
    });

    if (!inventory) {
      throw new NotFoundException(`Inventory with ID ${id} not found`);
    }

    return this.prisma.inventory.delete({
      where: { id },
    });
  }

  async assignLocation(
    inventoryId: number,
    locationId: number,
  ): Promise<Inventory> {
    const inventory = await this.prisma.inventory.findUnique({
      where: { id: inventoryId },
      include: { location: true },
    });

    if (!inventory) {
      throw new NotFoundException(`Inventory with ID ${inventoryId} not found`);
    }

    if (inventory.location) {
      throw new BadRequestException(
        'Inventory is already assigned to a location',
      );
    }

    return this.prisma.inventory.update({
      where: { id: inventoryId },
      data: {
        location: {
          connect: { id: locationId },
        },
      },
    });
  }
}
