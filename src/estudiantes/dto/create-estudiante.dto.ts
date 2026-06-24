import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateEstudianteDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsEmail()
  email!: string;
}
