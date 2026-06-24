import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CarrerasModule } from './carreras/carreras.module';
import { MateriasModule } from './materias/materias.module';
import { CiclosModule } from './ciclos/ciclos.module';
import { EstudiantesModule } from './estudiantes/estudiantes.module';
import { MatriculasModule } from './matriculas/matriculas.module';
import { LaboratoriosModule } from './laboratorios/laboratorios.module';
import { AsignacionesLaboratorioModule } from './asignaciones-laboratorio/asignaciones-laboratorio.module';

@Module({
  imports: [
    PrismaModule,
    CarrerasModule,
    MateriasModule,
    CiclosModule,
    EstudiantesModule,
    MatriculasModule,
    LaboratoriosModule,
    AsignacionesLaboratorioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
