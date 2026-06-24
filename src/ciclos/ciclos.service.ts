import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCicloDto } from './dto/create-ciclo.dto';

@Injectable()
export class CiclosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCicloDto: CreateCicloDto) {
    const { nombre, activo } = createCicloDto;

    try {
      return await this.prisma.ciclo.create({
        data: {
          nombre,
          activo: activo ?? true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('El ciclo ya existe.');
      }

      throw error;
    }
  }

  findAll() {
    return this.prisma.ciclo.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }
}
