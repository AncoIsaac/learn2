import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User, Person } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'prisma/prismaService/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService, // Inyecta el servicio de Prisma
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result as User;
    }
    return null;
  }

  async validatePerson(name: string): Promise<Person | null> {
    const person = await this.prisma.person.findUnique({
      where: { name },
    });
    return person;
  }

  async login(user: User) {
    const payload = { sub: user.id, role: user.role };
    return {
      message: 'Inicio de sesión exitosamente',
      access_token: this.jwtService.sign(payload),
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async loginPerson(person: Person) {
    const payload = { sub: person.id, role: 'accountant' }; // Puedes ajustar el payload según tus necesidades
    return {
      message: 'Inicio de sesión exitosamente',
      access_token: this.jwtService.sign(payload),
      data: {
        id: person.id,
        name: person.name,
        userId: person.userId,
        locationId: person.locationId,
      },
    };
  }
}
