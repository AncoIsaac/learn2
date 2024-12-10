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
    return this.prisma.location.findMany();
  }

  async findOne(id: number): Promise<Location | null> {
    return this.prisma.location.findUnique({
      where: { id },
    });
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
