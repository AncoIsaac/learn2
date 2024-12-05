import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt/jwt.strategy';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { PrismaService } from 'prisma/prismaService/prisma.service';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'your-secret-key', // Cambia esto por una clave secreta segura
      signOptions: { expiresIn: '1h' }, // Configura el tiempo de expiración del token
    }),
  ],
  providers: [AuthService, JwtStrategy, UsersService, PrismaService],
  controllers: [AuthController],
})
export class AuthModule {}
