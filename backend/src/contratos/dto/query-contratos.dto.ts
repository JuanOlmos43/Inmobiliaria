import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
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
}
