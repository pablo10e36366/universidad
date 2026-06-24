import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLaboratorioDto } from './dto/create-laboratorio.dto';

@Injectable()
export class LaboratoriosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLaboratorioDto: CreateLaboratorioDto) {
    try {
      return await this.prisma.laboratorio.create({
        data: createLaboratorioDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('El laboratorio ya existe.');
      }

      throw error;
    }
  }

  findAll() {
    return this.prisma.laboratorio.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }
}
