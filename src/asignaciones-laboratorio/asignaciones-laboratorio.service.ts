import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAsignacionLaboratorioDto } from './dto/create-asignacion-laboratorio.dto';

@Injectable()
export class AsignacionesLaboratorioService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createAsignacionLaboratorioDto: CreateAsignacionLaboratorioDto,
  ) {
    const { laboratorioId, matriculaId, materiaId, cicloId } =
      createAsignacionLaboratorioDto;

    const laboratorio = await this.prisma.laboratorio.findUnique({
      where: { id: laboratorioId },
    });

    if (!laboratorio) {
      throw new NotFoundException('El laboratorio indicado no existe.');
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

    const matricula = await this.prisma.matricula.findUnique({
      where: { id: matriculaId },
      include: {
        estudiante: true,
      },
    });

    if (!matricula) {
      throw new NotFoundException('La matricula indicada no existe.');
    }

    if (!matricula.activa) {
      throw new ConflictException('La matricula indicada no esta activa.');
    }

    if (matricula.cicloId !== cicloId) {
      throw new ConflictException(
        'La matricula no pertenece al ciclo indicado.',
      );
    }

    const materia = await this.prisma.materia.findUnique({
      where: { id: materiaId },
    });

    if (!materia) {
      throw new NotFoundException('La materia indicada no existe.');
    }

    if (materia.carreraId !== matricula.carreraId) {
      throw new ConflictException(
        'La materia no pertenece a la carrera de la matricula.',
      );
    }

    try {
      return await this.prisma.asignacionLaboratorio.create({
        data: {
          laboratorioId,
          matriculaId,
          materiaId,
          cicloId,
        },
        include: {
          laboratorio: true,
          materia: true,
          ciclo: true,
          matricula: {
            include: {
              estudiante: true,
              carrera: true,
            },
          },
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'La matricula ya tiene una asignacion para esa materia en ese ciclo.',
        );
      }

      throw error;
    }
  }

  findAll() {
    return this.prisma.asignacionLaboratorio.findMany({
      include: {
        laboratorio: true,
        materia: true,
        ciclo: true,
        matricula: {
          include: {
            estudiante: true,
            carrera: true,
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });
  }
}
