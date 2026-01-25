
import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateUploadUrlDto {
    @IsString()
    @IsNotEmpty()
    filename: string;
}
