import { ConflictException, Injectable } from '@nestjs/common';
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
    return this.prisma.location.delete({
      where: { id },
    });
  }
}
