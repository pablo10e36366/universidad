import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateAsignacionLaboratorioDto } from './dto/create-asignacion-laboratorio.dto';
import { AsignacionesLaboratorioService } from './asignaciones-laboratorio.service';

@Controller('asignaciones-laboratorio')
export class AsignacionesLaboratorioController {
  constructor(
    private readonly asignacionesLaboratorioService: AsignacionesLaboratorioService,
  ) {}

  @Post()
  create(
    @Body() createAsignacionLaboratorioDto: CreateAsignacionLaboratorioDto,
  ) {
    return this.asignacionesLaboratorioService.create(
      createAsignacionLaboratorioDto,
    );
  }

  @Get()
  findAll() {
    return this.asignacionesLaboratorioService.findAll();
  }
}
