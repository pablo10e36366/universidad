import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCicloDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
