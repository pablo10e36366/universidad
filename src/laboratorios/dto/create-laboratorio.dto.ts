import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateLaboratorioDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  capacidad: number;
}
