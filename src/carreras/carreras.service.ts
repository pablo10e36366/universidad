import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateCarreraDto } from './dto/create-carrera.dto';

@Injectable()
export class CarrerasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCarreraDto: CreateCarreraDto) {
    const { nombre, materias } = createCarreraDto;

    try {
      return await this.prisma.carrera.create({
        data: {
          nombre,
          materias: {
            create: materias.map(({ nombre }) => ({
              nombre,
            })),
          },
        },
        include: {
          materias: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'La carrera ya existe o una materia está repetida dentro de la carrera.',
        );
      }

      throw error;
    }
  }

  findAll() {
    return this.prisma.carrera.findMany({
      include: {
        materias: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }
}
