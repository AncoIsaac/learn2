import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWerehouseDto } from './dto/create-werehouse.dto';
import { UpdateWerehouseDto } from './dto/update-werehouse.dto';
import { PrismaService } from 'prisma/prismaService/prisma.service';
import { Werehouse } from '@prisma/client';

@Injectable()
export class WerehouseService {
  constructor(private prisma: PrismaService) {}

  async create(createWerehouseDto: CreateWerehouseDto): Promise<Werehouse> {
    const existingWerehouse = await this.prisma.werehouse.findUnique({
      where: { locationId: createWerehouseDto.locationId },
    });

    if (existingWerehouse) {
      throw new BadRequestException('Ya existe un almacén en esa ubicación');
    }

    try {
      return await this.prisma.$transaction(async (prisma) => {
        const createdWerehouse = await prisma.werehouse.create({
          data: createWerehouseDto,
        });
        const werehouseData = await this.prisma.werehouse.findUnique({
          where: { id: createdWerehouse.id },
          include: {
            location: true,
          },
        });
        return werehouseData;
      });
    } catch (error) {
      throw error;
    }
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

  async checkSameQuantityInLocation(locationId: number): Promise<{
    sameQuantity: boolean;
    counts: {
      [key: string]: {
        quantity: number;
        description: string;
        location: any;
        createdBy: any;
      };
    };
    werehouseQuantity?: number; // Agregamos la cantidad de werehouse
    message?: string; // Mensaje opcional
  }> {
    const werehouse = await this.prisma.werehouse.findMany({
      where: { locationId, deleted: false },
      select: {
        quantity: true,
        description: true,
      },
    });

    // Verificar si hay registros en werehouse
    if (werehouse.length === 0) {
      throw new BadRequestException(
        `No hay registros en el almacén para esa ubicación`,
      );
    }

    const werehouseQuantity = werehouse[0].quantity; // Asumimos que solo hay un registro en werehouse para esa ubicación

    // Consulta para obtener solo la propiedad `location` de los inventarios
    const inventaries = await this.prisma.inventory.findMany({
      where: {
        locationId,
        deleted: false,
      },
      select: {
        quantity: true,
        description: true,
        location: true, // Seleccionamos solo la propiedad `location`
        createdBy: true,
      },
    });

    if (inventaries.length === 0) {
      throw new BadRequestException(`No hay conteos en esa ubicación`);
    }

    const quantities = inventaries.map((inventory) => inventory.quantity);

    const referenceQuantity = quantities[0];

    const allSameQuantity = quantities.every(
      (quantity) => quantity === referenceQuantity,
    );

    // Verificar si las cantidades en inventaries coinciden con la cantidad en werehouse
    const matchWerehouseQuantity = quantities.every(
      (quantity) => quantity === werehouseQuantity,
    );

    const counts = inventaries.reduce(
      (acc, inventory, index) => {
        const countsName = `Conteo ${index + 1}`;

        acc[countsName] = {
          quantity: inventory.quantity,
          description: inventory.description,
          location: inventory.location,
          createdBy: inventory.createdBy,
        };
        return acc;
      },
      {} as {
        [key: string]: {
          quantity: number;
          description: string;
          location: any;
          createdBy: any;
        };
      },
    );

    // Si las cantidades no coinciden con el inventario, devolvemos un mensaje
    if (!matchWerehouseQuantity) {
      return {
        sameQuantity: allSameQuantity,
        counts,
        werehouseQuantity, // Mostramos la cantidad de werehouse
        message: 'Los conteos no coinciden con lo del inventario',
      };
    }

    return {
      sameQuantity: allSameQuantity,
      counts,
      werehouseQuantity, // Mostramos la cantidad de werehouse
      message: 'Los conteos coinciden con lo del inventario',
    };
  }
}
