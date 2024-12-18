import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWerehouseDto } from './dto/create-werehouse.dto';
import { UpdateWerehouseDto } from './dto/update-werehouse.dto';
import { PrismaService } from 'prisma/prismaService/prisma.service';
import { Werehouse } from '@prisma/client';

@Injectable()
export class WerehouseService {
  constructor(private prisma: PrismaService) {}

  async create(createWerehouseDto: CreateWerehouseDto): Promise<Werehouse> {
    const createdWerehouse = await this.prisma.werehouse.create({
      data: createWerehouseDto,
    });

    const werehouseData = await this.prisma.werehouse.findUnique({
      where: { id: createdWerehouse.id },
      include: {
        location: true,
      },
    });

    return werehouseData;
  }

  async findAll(): Promise<Werehouse[]> {
    const findAllWerehouse = await this.prisma.werehouse.findMany({
      where: {
        deleted: false,
      },
      include: {
        location: true,
      },
    });

    return findAllWerehouse;
  }

  async findOne(id: number): Promise<Werehouse | null> {
    const werehouse = await this.prisma.werehouse.findUnique({
      where: { id },
      include: {
        location: true,
      },
    });

    if (!werehouse) {
      throw new NotFoundException('Almacen no existe');
    }

    return werehouse;
  }

  async update(
    id: number,
    updateWerehouseDto: UpdateWerehouseDto,
  ): Promise<Werehouse> {
    const werehouse = await this.prisma.werehouse.findUnique({
      where: { id },
    });

    if (!werehouse) {
      throw new NotFoundException('No se puede actulizar');
    }

    return this.prisma.werehouse.update({
      where: { id },
      data: updateWerehouseDto,
    });
  }

  async remove(id: number): Promise<{ data: Werehouse; message: string }> {
    const werehouse = await this.prisma.werehouse.findUnique({
      where: { id },
    });

    if (!werehouse) {
      throw new NotFoundException('EL usuario no exite');
    }
    const deleteData = await this.prisma.werehouse.update({
      where: { id },
      data: { deleted: true },
    });
    return { data: deleteData, message: 'Almacen eliminado correctamente' };
  }
}
