import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateLaboratorioDto } from './dto/create-laboratorio.dto';
import { LaboratoriosService } from './laboratorios.service';

@Controller('laboratorios')
export class LaboratoriosController {
  constructor(private readonly laboratoriosService: LaboratoriosService) {}

  @Post()
  create(@Body() createLaboratorioDto: CreateLaboratorioDto) {
    return this.laboratoriosService.create(createLaboratorioDto);
  }

  @Get()
  findAll() {
    return this.laboratoriosService.findAll();
  }
}
