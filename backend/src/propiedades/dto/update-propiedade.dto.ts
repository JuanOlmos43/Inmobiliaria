import { PartialType } from '@nestjs/mapped-types';
import { CreatePropiedadeDto } from './create-propiedade.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { PropertyStatus } from '@prisma/client';

export class UpdatePropiedadeDto extends PartialType(CreatePropiedadeDto) {
  @IsOptional()
  @IsEnum(PropertyStatus)
  status?: PropertyStatus;

  @IsOptional()
  images?: string[];
}
