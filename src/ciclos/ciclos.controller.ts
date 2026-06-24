import { Body, Controller, Get, Post } from '@nestjs/common';
import { CiclosService } from './ciclos.service';
import { CreateCicloDto } from './dto/create-ciclo.dto';

@Controller('ciclos')
export class CiclosController {
  constructor(private readonly ciclosService: CiclosService) {}

  @Post()
  create(@Body() createCicloDto: CreateCicloDto) {
    return this.ciclosService.create(createCicloDto);
  }

  @Get()
  findAll() {
    return this.ciclosService.findAll();
  }
}
