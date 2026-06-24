import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateMateriaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  carreraId: number;
}
