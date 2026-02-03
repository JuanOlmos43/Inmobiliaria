import {
    IsDateString,
    IsEnum,
    IsNumber,
    IsOptional,
    IsUUID,
    Min,
} from 'class-validator';
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
    monthlyRent: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    deposit?: number;

    @IsOptional()
    @IsNumber()
    adjustmentPercentage?: number;

    @IsDateString()
    startDate: string;

    @IsDateString()
    endDate: string;

    @IsOptional()
    @IsDateString()
    nextAdjustmentDate?: string;

    @IsOptional()
    @IsDateString()
    actualEndDate?: string;

    @IsOptional()
    @IsEnum(ContractStatus)
    status?: ContractStatus;
}
