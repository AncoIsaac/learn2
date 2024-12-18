import { Module } from '@nestjs/common';
import { WerehouseService } from './werehouse.service';
import { WerehouseController } from './werehouse.controller';
import { PrismaModule } from 'prisma/prismaService/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WerehouseController],
  providers: [WerehouseService],
})
export class WerehouseModule {}
