import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContratoDto } from './dto/create-contrato.dto';
import { UpdateContratoDto } from './dto/update-contrato.dto';
import { PrismaService } from '../prisma/prisma.service';
import { QueryContratosDto } from './dto/query-contratos.dto';

@Injectable()
export class ContratosService {
  constructor(private prisma: PrismaService) { }

  async create(createContratoDto: CreateContratoDto) {
    return this.prisma.rentalContract.create({
      data: createContratoDto,
      include: {
        property: true,
        tenant: {
          select: { id: true, name: true, email: true },
        },
        landlord: {
          select: { id: true, name: true, email: true },
        },
        agent: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async findAll(query: QueryContratosDto) {
    const { status, propertyId, tenantId, landlordId, agentId } = query;
    return this.prisma.rentalContract.findMany({
      where: {
        status,
        propertyId,
        tenantId,
        landlordId,
        agentId,
      },
      include: {
        property: true,
        tenant: {
          select: { id: true, name: true, email: true },
        },
        landlord: {
          select: { id: true, name: true, email: true },
        },
        agent: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const contrato = await this.prisma.rentalContract.findUnique({
      where: { id },
      include: {
        property: true,
        tenant: {
          select: { id: true, name: true, email: true, phone: true },
        },
        landlord: {
          select: { id: true, name: true, email: true, phone: true },
        },
        agent: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });
    if (!contrato) {
      throw new NotFoundException(`Contract with ID ${id} not found`);
    }
    return contrato;
  }

  async update(id: string, updateContratoDto: UpdateContratoDto) {
    await this.findOne(id); // Validate existence

    return this.prisma.rentalContract.update({
      where: { id },
      data: updateContratoDto,
      include: {
        property: true,
        tenant: {
          select: { id: true, name: true, email: true },
        },
        landlord: {
          select: { id: true, name: true, email: true },
        },
        agent: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Validate existence
    return this.prisma.rentalContract.delete({
      where: { id },
    });
  }
}
