import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonsController } from './person.controller';
import { PrismaModule } from 'prisma/prismaService/prisma.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [PrismaModule, NotificationsModule],
  controllers: [PersonsController],
  providers: [PersonService],
})
export class PersonModule {}
