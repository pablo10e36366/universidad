import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { EstudiantesService } from './estudiantes.service';

@Controller('estudiantes')
export class EstudiantesController {
  constructor(
    private readonly estudiantesService: EstudiantesService,
  ) {}

  @Post()
  create(@Body() createEstudianteDto: CreateEstudianteDto) {
    return this.estudiantesService.create(createEstudianteDto);
  }

  @Get()
  findAll() {
    return this.estudiantesService.findAll();
  }
}
