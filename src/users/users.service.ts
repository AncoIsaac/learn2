import {
  Injectable,
  ConflictException,
  NotFoundException,
  // BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, Person } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prismaService/prisma.service';
import { CreatePersonDto } from 'src/person/dto/create-person.dto';

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
        deleted: true,
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
        deleted: true,
      },
    });
    return user;
  }

  // async findOneByEmail(email: string): Promise<User | null> {
  //   return this.prisma.user.findUnique({
  //     where: { email },
  //   });
  // }

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
    const users = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!users) {
      throw new NotFoundException(`Person with ID ${id} not found`);
    }

    return this.prisma.user.update({
      where: { id },
      data: { deleted: true },
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
}
