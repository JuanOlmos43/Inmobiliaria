import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ContractStatus } from '@prisma/client';

export class QueryContratosDto {
  @IsOptional()
  @IsEnum(ContractStatus)
  status?: ContractStatus;

  @IsOptional()
  @IsUUID()
  propertyId?: string;

  @IsOptional()
  @IsUUID()
  tenantId?: string;

  @IsOptional()
  @IsUUID()
  landlordId?: string;

  @IsOptional()
  @IsUUID()
  agentId?: string;

  // Filtros de texto (Búsqueda parcial)
  @IsOptional()
  @IsString()
  tenantName?: string;

  @IsOptional()
  @IsString()
  landlordName?: string;

  @IsOptional()
  @IsString()
  propertyLocation?: string;

  // Paginación
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
