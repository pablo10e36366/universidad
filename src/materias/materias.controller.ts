import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { MateriasService } from './materias.service';

@Controller('materias')
export class MateriasController {
  constructor(private readonly materiasService: MateriasService) {}

  @Post()
  create(@Body() createMateriaDto: CreateMateriaDto) {
    return this.materiasService.create(createMateriaDto);
  }

  @Get()
  findAll() {
    return this.materiasService.findAll();
  }
}
