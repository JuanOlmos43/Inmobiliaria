import { IsNotEmpty, IsString, IsInt, IsOptional, Min } from 'class-validator';

export class GenerateUploadUrlDto {
  @IsString()
  @IsNotEmpty()
  filename: string;
}

export class ConfirmImageUploadDto {
  @IsString()
  @IsNotEmpty()
  path: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
