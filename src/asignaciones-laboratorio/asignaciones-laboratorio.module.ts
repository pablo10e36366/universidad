import { Module } from '@nestjs/common';
import { AsignacionesLaboratorioController } from './asignaciones-laboratorio.controller';
import { AsignacionesLaboratorioService } from './asignaciones-laboratorio.service';

@Module({
  controllers: [AsignacionesLaboratorioController],
  providers: [AsignacionesLaboratorioService],
})
export class AsignacionesLaboratorioModule {}
