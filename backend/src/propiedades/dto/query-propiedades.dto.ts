import {
  IsOptional,
  IsEnum,
  IsUUID,
  IsNumber,
  Min,
  IsInt,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  PropertyType,
  PropertyListingType,
  PropertyStatus,
} from '@prisma/client';

export class QueryPropiedadesDto {
  // Filtros
  @IsOptional()
  @IsEnum(PropertyType)
  propertyType?: PropertyType;

  @IsOptional()
  @IsEnum(PropertyListingType)
  listingType?: PropertyListingType;

  @IsOptional()
  @IsEnum(PropertyStatus)
  status?: PropertyStatus;

  @IsOptional()
  @IsString()
  contractStatus?: string;

  @IsOptional()
  @IsUUID()
  localidadId?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minBedrooms?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minBathrooms?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minArea?: number;

  @IsOptional()
  @IsUUID()
  ownerId?: string;

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
