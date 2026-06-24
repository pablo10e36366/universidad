import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateMateriaDto } from './dto/create-materia.dto';

@Injectable()
export class MateriasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMateriaDto: CreateMateriaDto) {
    const { nombre, carreraId } = createMateriaDto;

    const carrera = await this.prisma.carrera.findUnique({
      where: { id: carreraId },
    });

    if (!carrera) {
      throw new NotFoundException('La carrera indicada no existe.');
    }

    try {
      return await this.prisma.materia.create({
        data: {
          nombre,
          carreraId,
        },
        include: {
          carrera: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'La materia ya existe dentro de esa carrera.',
        );
      }

      throw error;
    }
  }

  findAll() {
    return this.prisma.materia.findMany({
      include: {
        carrera: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }
}
