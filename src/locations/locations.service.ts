import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { PrismaService } from 'prisma/prismaService/prisma.service';
import { Location } from '@prisma/client';

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    const existingUser = await this.prisma.location.findUnique({
      where: { name: createLocationDto.name },
    });

    if (existingUser) {
      throw new ConflictException('location already registered');
    }

    try {
      return await this.prisma.$transaction(async (prisma) => {
        const person = await prisma.location.create({
          data: createLocationDto,
        });
        return person;
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<Location[]> {
    const location = this.prisma.location.findMany({
      include: {
        persons: true,
      },
    });

    return (await location).map((location) => ({
      ...location,
      persons:
        location.persons.length > 0
          ? location.persons
          : 'No hay personas asignadas',
    }));
  }

  async findOne(id: number): Promise<{ location: Location; message: string }> {
    const location = await this.prisma.location.findUnique({
      where: { id },
      include: {
        persons: true, // Incluye las personas relacionadas
      },
    });

    if (!location) {
      return { location: null, message: 'No existe la Ubicacion' };
    }

    // Agrega un campo adicional para el mensaje si no hay personas asignadas
    return {
      location: location,
      message:
        location.persons.length > 0 ? undefined : 'No hay personas asignadas',
    };
  }

  async update(
    id: number,
    updateLocationDto: UpdateLocationDto,
  ): Promise<Location> {
    return this.prisma.location.update({
      where: { id },
      data: updateLocationDto,
    });
  }

  async remove(id: number) {
    const location = await this.prisma.person.findUnique({
      where: { id },
    });

    if (!location) {
      throw new NotFoundException(`Person with ID ${id} not found`);
    }

    // Marcar la persona como eliminada (eliminación lógica)
    return this.prisma.person.update({
      where: { id },
      data: { deleted: true }, // Actualiza el campo `deleted` a `true`
    });
  }
}
