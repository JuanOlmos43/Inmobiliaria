
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateContactDto {
    @IsString()
    @IsNotEmpty()
    nombreCompleto: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsOptional()
    telefono?: string;

    @IsString()
    @IsNotEmpty()
    asunto: string;

    @IsString()
    @IsNotEmpty()
    mensaje: string;
}
