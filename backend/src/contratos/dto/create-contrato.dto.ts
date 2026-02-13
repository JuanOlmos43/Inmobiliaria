import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ContractStatus } from '@prisma/client';

export class CreateContratoDto {
  @IsUUID()
  propertyId: string;

  @IsUUID()
  tenantId: string;

  @IsUUID()
  landlordId: string;

  @IsOptional()
  @IsUUID()
  agentId?: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  monthlyRent: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  deposit?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(12)
  @Type(() => Number)
  adjustmentFrequency?: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsDateString()
  actualEndDate?: string;

  @IsOptional()
  @IsEnum(ContractStatus)
  status?: ContractStatus;
}
