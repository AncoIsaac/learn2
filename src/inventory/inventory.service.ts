import {
  BadRequestException,
  ConflictException,
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
    try {
      return this.prisma.$transaction(async (prisma) => {
        // Verificar si el locationId existe
        const locationExists = await prisma.location.findUnique({
          where: { id: createInventoryDto.locationId },
        });
        const perosonsExists = await prisma.person.findUnique({
          where: { id: createInventoryDto.createdById },
        });

        if (!locationExists) {
          throw new ConflictException(
            'El locationId proporcionado no existe en la tabla Location',
          );
        }

        if (!perosonsExists) {
          throw new ConflictException('La persona proporcionada no existe ');
        }

        // Crear el inventario
        const createdInventory = await prisma.inventory.create({
          data: createInventoryDto,
        });

        // Obtener el inventario con las relaciones incluidas
        const inventoryWithRelations = await prisma.inventory.findUnique({
          where: { id: createdInventory.id },
          include: {
            location: true,
            createdBy: true,
          },
        });

        return inventoryWithRelations;
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<Inventory[]> {
    const findAllInventory = await this.prisma.inventory.findMany({
      where: {
        deleted: false, // Filtrar inventarios no eliminados
      },
      include: {
        location: true, // Incluir la ubicación
        createdBy: true, // Incluir la persona que creó el inventario
      },
    });

    // Mapear los resultados para devolver un objeto con la clave "inventory"
    return findAllInventory;
  }

  async findOne(id: number): Promise<Inventory | null> {
    const inventory = await this.prisma.inventory.findUnique({
      where: { id },
      include: {
        location: true,
        createdBy: true,
      },
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
  ): Promise<{ person: Person; message: string }> {
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
        `Location ${existingPersonWithLocation.location.name} is already assigned to another person: ${existingPersonWithLocation.name}`,
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

    return {
      message: 'Ubicación agregada correctamente',
      person: updatedPerson,
    };
  }

  async checkSameQuantityInLocation(locationId: number): Promise<{
    sameQuantity: boolean;
    counts: {
      [key: string]: {
        quantity: number;
        description: string;
        location: any; // Cambiamos el tipo para permitir el objeto completo de location
      };
    };
  }> {
    // Consulta para obtener solo la propiedad `location` de los inventarios
    const inventaries = await this.prisma.inventory.findMany({
      where: {
        locationId,
        deleted: false,
      },
      select: {
        quantity: true,
        description: true,
        location: true, // Seleccionamos solo la propiedad `location`
      },
    });

    if (inventaries.length === 0) {
      throw new BadRequestException(`No hay conteos en esa ubicación`);
    }

    const quantities = inventaries.map((inventory) => inventory.quantity);

    const referenceQuantity = quantities[0];

    const allSameQuantity = quantities.every(
      (quantity) => quantity === referenceQuantity,
    );

    const counts = inventaries.reduce(
      (acc, inventory, index) => {
        const countsName = `Conteo ${index + 1}`;

        acc[countsName] = {
          quantity: inventory.quantity,
          description: inventory.description,
          location: inventory.location,
        };
        return acc;
      },
      {} as {
        [key: string]: { quantity: number; description: string; location: any };
      },
    );

    return {
      sameQuantity: allSameQuantity,
      counts,
    };
  }
}
