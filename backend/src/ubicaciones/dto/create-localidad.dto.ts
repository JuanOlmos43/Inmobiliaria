import { IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateLocalidadDto {
    @IsString()
    @MaxLength(100)
    nombre: string;

    @IsUUID()
    provinciaId: string;
}
