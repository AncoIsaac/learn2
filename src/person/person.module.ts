import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonsController } from './person.controller';
import { PrismaModule } from 'prisma/prismaService/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PersonsController],
  providers: [PersonService],
})
export class PersonModule {}
