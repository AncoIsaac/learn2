import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { PrismaService } from 'prisma/prismaService/prisma.service';
import { Inventory, Person } from '@prisma/client';
import { AssignInventoryDto } from './dto/assign-inventory.dto';

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
    const inventory = await this.prisma.inventory.findUnique({
      where: { id },
    });

    if (!inventory) {
      throw new NotFoundException(`Inventory with ID ${id} not found`);
    }

    return inventory;
  }

  async update(
    id: number,
    updateInventoryDto: UpdateInventoryDto,
  ): Promise<Inventory> {
    const inventory = await this.prisma.inventory.findUnique({
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

    return this.prisma.inventory.update({
      where: { id },
      data: { deleted: true },
    });
  }

  async assignLocationToPerson(
    assignInventoryDto: AssignInventoryDto,
  ): Promise<Person> {
    const { personId, locationId } = assignInventoryDto;

    // Verificar si la persona existe
    const person = await this.prisma.person.findUnique({
      where: { id: personId },
      include: { location: true },
    });

    if (!person) {
      throw new NotFoundException(`Person with ID ${personId} not found`);
    }

    // Verificar si la persona ya tiene una ubicación asignada
    if (person.location) {
      throw new BadRequestException('Person is already assigned to a location');
    }

    // Verificar si la ubicación ya está asignada a otra persona
    const existingPersonWithLocation = await this.prisma.person.findFirst({
      where: { locationId, id: { not: personId } }, // Busca a otra persona con la misma ubicación
      include: { location: true },
    });

    if (existingPersonWithLocation) {
      throw new BadRequestException(
        `Location with ID ${locationId} is already assigned to another person: ${existingPersonWithLocation.name}`,
      );
    }

    // Asignar la ubicación a la persona
    const updatedPerson = await this.prisma.person.update({
      where: { id: personId },
      data: {
        location: {
          connect: { id: locationId },
        },
      },
      include: { location: true }, // Incluye la ubicación en la respuesta
    });

    return updatedPerson;
  }

  // Método para iniciar el conteo de inventarios
  async startInventoryCount(
    personId: number,
    inventoryId: number,
  ): Promise<Inventory> {
    const person = await this.prisma.person.findUnique({
      where: { id: personId },
      include: { location: true },
    });

    if (!person) {
      throw new NotFoundException(`Person with ID ${personId} not found`);
    }

    if (!person.location) {
      throw new BadRequestException('Person is not assigned to a location');
    }

    const inventory = await this.prisma.inventory.findUnique({
      where: { id: inventoryId },
      include: { location: true },
    });

    if (!inventory) {
      throw new NotFoundException(`Inventory with ID ${inventoryId} not found`);
    }

    if (inventory.locationId !== person.locationId) {
      throw new BadRequestException(
        'Inventory is not located in the assigned location',
      );
    }

    return inventory;
  }
}
