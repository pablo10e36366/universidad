import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsInt,
  IsPositive,
} from 'class-validator';

export class CreateMatriculaDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  carreraId: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  cicloId: number;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @Type(() => Number)
  @IsInt({ each: true })
  @IsPositive({ each: true })
  estudianteIds: number[];
}
