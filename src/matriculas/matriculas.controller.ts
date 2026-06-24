import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { MatriculasService } from './matriculas.service';

@Controller('matriculas')
export class MatriculasController {
  constructor(private readonly matriculasService: MatriculasService) {}

  @Post()
  create(@Body() createMatriculaDto: CreateMatriculaDto) {
    return this.matriculasService.create(createMatriculaDto);
  }

  @Get()
  findAll() {
    return this.matriculasService.findAll();
  }
}
