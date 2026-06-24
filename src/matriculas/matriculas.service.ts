import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMatriculaDto } from './dto/create-matricula.dto';

@Injectable()
export class MatriculasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMatriculaDto: CreateMatriculaDto) {
    const { carreraId, cicloId, estudianteIds } = createMatriculaDto;

    const carrera = await this.prisma.carrera.findUnique({
      where: { id: carreraId },
    });

    if (!carrera) {
      throw new NotFoundException('La carrera indicada no existe.');
    }

    const ciclo = await this.prisma.ciclo.findUnique({
      where: { id: cicloId },
    });

    if (!ciclo) {
      throw new NotFoundException('El ciclo indicado no existe.');
    }

    if (!ciclo.activo) {
      throw new ConflictException('El ciclo indicado no esta activo.');
    }

    const estudiantes = await this.prisma.estudiante.findMany({
      where: {
        id: {
          in: estudianteIds,
        },
      },
      orderBy: {
        id: 'asc',
      },
    });

    const estudiantesEncontrados = new Set(estudiantes.map((estudiante) => estudiante.id));
    const faltantes = estudianteIds.filter(
      (id) => !estudiantesEncontrados.has(id),
    );

    if (faltantes.length > 0) {
      throw new NotFoundException(
        `No existen los estudiantes con ids: ${faltantes.join(', ')}.`,
      );
    }

    try {
      await this.prisma.$transaction(
        estudianteIds.map((estudianteId) =>
          this.prisma.matricula.create({
            data: {
              activa: true,
              carreraId,
              cicloId,
              estudianteId,
            },
          }),
        ),
      );
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Uno o mas estudiantes ya tienen matricula en esa carrera y ciclo.',
        );
      }

      throw error;
    }

    return this.prisma.matricula.findMany({
      where: {
        carreraId,
        cicloId,
        estudianteId: {
          in: estudianteIds,
        },
      },
      include: {
        carrera: true,
        ciclo: true,
        estudiante: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  findAll() {
    return this.prisma.matricula.findMany({
      include: {
        carrera: true,
        ciclo: true,
        estudiante: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }
}
