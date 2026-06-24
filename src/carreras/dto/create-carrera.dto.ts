import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateCarreraMateriaDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;
}

export class CreateCarreraDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateCarreraMateriaDto)
  materias!: CreateCarreraMateriaDto[];
}
