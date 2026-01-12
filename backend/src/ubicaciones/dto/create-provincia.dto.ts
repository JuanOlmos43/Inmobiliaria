import { IsString, MaxLength } from 'class-validator';

export class CreateProvinciaDto {
    @IsString()
    @MaxLength(100)
    nombre: string;
}
