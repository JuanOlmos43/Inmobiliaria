import { IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateCalleDto {
  @IsString()
  @MaxLength(100)
  nombre: string;

  @IsUUID()
  localidadId: string;
}
