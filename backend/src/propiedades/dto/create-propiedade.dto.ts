import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
  IsInt,
  MaxLength,
} from 'class-validator';
import {
  PropertyType,
  PropertyListingType,
  PropertyStatus,
} from '@prisma/client';

export class CreatePropiedadeDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString({ each: true })
  features?: string[];

  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @IsEnum(PropertyListingType)
  listingType: PropertyListingType;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsEnum(PropertyStatus)
  status?: PropertyStatus;

  // Características físicas
  @IsInt()
  @Min(0)
  bedrooms: number;

  @IsInt()
  @Min(0)
  rooms: number;

  @IsInt()
  @Min(0)
  bathrooms: number;

  @IsNumber()
  @Min(0)
  area: number;

  @IsOptional()
  @IsInt()
  @Min(1800)
  yearBuilt?: number;

  // Ubicación
  @IsOptional()
  @IsString()
  streetNumber?: string;

  @IsOptional()
  @IsString()
  apartment?: string;

  @IsOptional()
  @IsUUID()
  calleId?: string;

  @IsOptional()
  @IsUUID()
  localidadId?: string;

  @IsOptional()
  @IsUUID()
  provinciaId?: string;

  @IsOptional()
  @IsString()
  location?: string;

  // Multimedia
  @IsOptional()
  @IsString()
  mainImage?: string;

  // Relaciones
  @IsOptional()
  @IsUUID()
  ownerId?: string;

  @IsOptional()
  @IsUUID()
  agentId?: string;
}
