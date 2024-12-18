import { Module } from '@nestjs/common';
import { WerehouseService } from './werehouse.service';
import { WerehouseController } from './werehouse.controller';

@Module({
  controllers: [WerehouseController],
  providers: [WerehouseService],
})
export class WerehouseModule {}
