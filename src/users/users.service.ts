import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, Person, Inventory, Location } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prismaService/prisma.service';
import { CreatePersonDto } from 'src/person/dto/create-person.dto';
import { AssignInventoryDto } from 'src/inventory/dto/assign-inventory.dto';
import { CreateLocationDto } from 'src/locations/dto/create-location.dto';
import { AssignLocationDto } from 'src/locations/dto/assign-location.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    try {
      return await this.prisma.$transaction(async (prisma) => {
        const user = await prisma.user.create({
          data: {
            ...createUserDto,
            password: hashedPassword,
          },
        });
        return user;
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
    return users;
  }

  async findOne(id: number): Promise<Omit<User, 'password'> | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
    return user;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async createPerson(
    userId: number,
    createPersonDto: CreatePersonDto,
  ): Promise<Person> {
    return this.prisma.person.create({
      data: {
        ...createPersonDto,
        userId,
      },
    });
  }

  async assignInventoryToPerson(
    assignInventoryDto: AssignInventoryDto,
  ): Promise<Person> {
    const { personId, inventoryId } = assignInventoryDto;

    return this.prisma.person.update({
      where: { id: personId },
      data: {
        inventories: {
          connect: { id: inventoryId },
        },
      },
    });
  }

  async createLocation(
    createLocationDto: CreateLocationDto,
  ): Promise<Location> {
    return this.prisma.location.create({
      data: createLocationDto,
    });
  }

  async assignLocationToInventory(
    assignLocationDto: AssignLocationDto,
  ): Promise<Inventory> {
    const { inventoryId, locationId } = assignLocationDto;

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
