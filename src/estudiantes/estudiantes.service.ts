import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';

@Injectable()
export class EstudiantesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEstudianteDto: CreateEstudianteDto) {
    const { nombre, email } = createEstudianteDto;

    try {
      return await this.prisma.estudiante.create({
        data: {
          nombre,
          email,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('El estudiante ya existe.');
      }

      throw error;
    }
  }

  findAll() {
    return this.prisma.estudiante.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }
}
