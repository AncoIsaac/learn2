// persons.service.ts
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Person } from '@prisma/client';
import { PrismaService } from 'prisma/prismaService/prisma.service';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';

@Injectable()
export class PersonService {
  constructor(
    private prisma: PrismaService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async create(
    createPersonDto: CreatePersonDto,
  ): Promise<{ person: Person; userCreate: string }> {
    const normalizedName = createPersonDto.name.toLowerCase();

    const existingPerson = await this.prisma.person.findFirst({
      where: {
        name: {
          equals: normalizedName,
          mode: 'insensitive',
        },
      },
    });

    if (existingPerson) {
      throw new ConflictException(
        `Person with name "${createPersonDto.name}" already exists`,
      );
    }
    console.log('existingPerson :>> ', existingPerson);

    try {
      return await this.prisma.$transaction(async (prisma) => {
        const person = prisma.person.create({
          data: createPersonDto,
        });
        const user = this.prisma.user.findUnique({
          where: { id: (await person).userId },
          select: { name: true },
        });

        return {
          person: {
            id: (await person).id,
            name: (await person).name,
            userId: (await person).userId,
            deleted: (await person).deleted,
            locationId: (await person).locationId,
          },
          userCreate: (await user).name || 'Unknown',
        };
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<{ person: Person }[]> {
    const persons = await this.prisma.person.findMany({
      where: {
        deleted: false,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        location: {
          select: {
            name: true,
          },
        },
      },
    });

    // Mapear los resultados para incluir el nombre del usuario
    return persons.map((person) => ({
      person,
    }));
  }

  async findOne(id: number): Promise<{ person: Person } | null> {
    const person = await this.prisma.person.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        location: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!person) {
      throw new NotFoundException(`Person with ID ${id} not found`);
    }

    // Retornar un objeto con la persona y el nombre del usuario
    return {
      person,
    };
  }

  async update(id: number, updatePersonDto: UpdatePersonDto): Promise<Person> {
    const person = await this.prisma.person.findUnique({
      where: { id },
    });

    if (!person) {
      throw new NotFoundException(`Person with ID ${id} not found`);
    }

    return this.prisma.person.update({
      where: { id },
      data: updatePersonDto,
    });
  }

  async remove(id: number): Promise<Person> {
    const person = await this.prisma.person.findUnique({
      where: { id },
    });

    if (!person) {
      throw new NotFoundException(`Person with ID ${id} not found`);
    }

    // Marcar la persona como eliminada (eliminación lógica)
    return this.prisma.person.update({
      where: { id },
      data: { deleted: true }, // Actualiza el campo `deleted` a `true`
    });
  }

  async removeLocationFromPerson(personId: number): Promise<Person> {
    // Verificar si la persona existe
    const person = await this.prisma.person.findUnique({
      where: { id: personId },
      include: { location: true },
    });

    if (!person) {
      throw new NotFoundException(`Person with ID ${personId} not found`);
    }

    // Verificar si la persona tiene una ubicación asignada
    if (!person.location) {
      throw new BadRequestException(
        `Person with ID ${personId} does not have a location assigned`,
      );
    }

    // Quitar la ubicación asignada a la persona
    const updatedPerson = await this.prisma.person.update({
      where: { id: personId },
      data: {
        location: {
          disconnect: true,
        },
      },
      include: { location: true },
    });

    // Enviar notificación en tiempo real
    this.notificationsGateway.sendNotification('locationRemoved', {
      message: `La ubicación ha sido terminada por ${updatedPerson.name}`,
      person: updatedPerson,
    });

    return updatedPerson;
  }
}
