import { IsString, MaxLength } from 'class-validator';

export class UpdateProvinciaDto {
  @IsString()
  @MaxLength(100)
  nombre: string;
}

export class UpdateLocalidadDto {
  @IsString()
  @MaxLength(100)
  nombre: string;
}

export class UpdateCalleDto {
  @IsString()
  @MaxLength(100)
  nombre: string;
}
