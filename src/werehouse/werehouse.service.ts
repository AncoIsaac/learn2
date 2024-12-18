import { Injectable } from '@nestjs/common';
import { CreateWerehouseDto } from './dto/create-werehouse.dto';
import { UpdateWerehouseDto } from './dto/update-werehouse.dto';

@Injectable()
export class WerehouseService {
  create(createWerehouseDto: CreateWerehouseDto) {
    return 'This action adds a new werehouse';
  }

  findAll() {
    return `This action returns all werehouse`;
  }

  findOne(id: number) {
    return `This action returns a #${id} werehouse`;
  }

  update(id: number, updateWerehouseDto: UpdateWerehouseDto) {
    return `This action updates a #${id} werehouse`;
  }

  remove(id: number) {
    return `This action removes a #${id} werehouse`;
  }
}
