import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class CreateAsignacionLaboratorioDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  laboratorioId: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  matriculaId: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  materiaId: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  cicloId: number;
}
