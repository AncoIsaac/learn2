// persons.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Person } from '@prisma/client';
import { PrismaService } from 'prisma/prismaService/prisma.service';

@Injectable()
export class PersonService {
  constructor(private prisma: PrismaService) {} // Inyecta PrismaService

  async create(createPersonDto: CreatePersonDto): Promise<Person> {
    return this.prisma.person.create({
      data: createPersonDto,
    });
  }

  async findAll(): Promise<Person[]> {
    return this.prisma.person.findMany();
  }

  async findOne(id: number): Promise<Person | null> {
    const person = await this.prisma.person.findUnique({
      where: { id },
    });

    if (!person) {
      throw new NotFoundException(`Person with ID ${id} not found`);
    }

    return person;
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

    return this.prisma.person.delete({
      where: { id },
    });
  }
}
