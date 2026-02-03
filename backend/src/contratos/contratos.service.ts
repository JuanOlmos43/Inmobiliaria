import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateContratoDto } from './dto/create-contrato.dto';
import { UpdateContratoDto } from './dto/update-contrato.dto';
import { PrismaService } from '../prisma/prisma.service';
import { QueryContratosDto } from './dto/query-contratos.dto';

@Injectable()
export class ContratosService {
  constructor(private prisma: PrismaService) { }

  private addMonths(date: Date, months: number): Date {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
  }

  private validateDates(start: Date, end: Date) {
    if (start >= end) {
      throw new BadRequestException('La fecha de inicio debe ser anterior a la fecha de fin');
    }
  }

  private calculateNextAdjustmentDate(startDate: Date, endDate: Date, frequencyMonths?: number | null): Date | null {
    if (!frequencyMonths) return null;

    const nextDate = this.addMonths(startDate, frequencyMonths);

    // "siempre comprobando que el resultado sea menor o igual a endDate"
    // Si la fecha calculada supera el fin del contrato, no hay próximo ajuste (null)
    if (nextDate > endDate) {
      return null;
    }

    return nextDate;
  }

  async create(createContratoDto: CreateContratoDto) {
    const startDate = new Date(createContratoDto.startDate);
    const endDate = new Date(createContratoDto.endDate);

    this.validateDates(startDate, endDate);

    const nextAdjustmentDate = this.calculateNextAdjustmentDate(
      startDate,
      endDate,
      createContratoDto.adjustmentFrequency,
    );

    return this.prisma.rentalContract.create({
      data: {
        ...createContratoDto,
        nextAdjustmentDate,
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
    });
  }

  async findAll(query: QueryContratosDto) {
    const {
      status,
      propertyId,
      tenantId,
      landlordId,
      agentId,
      tenantName,
      landlordName,
      propertyLocation,
      page = 1,
      limit = 10,
    } = query;

    const skip = (page - 1) * limit;

    // Construcción dinámica del filtro WHERE
    const where: any = {
      status, // Exact match
      propertyId,
      tenantId,
      landlordId,
      agentId,
    };

    // Filtros de texto parcial (insensitive)
    if (tenantName) {
      where.tenant = {
        name: { contains: tenantName, mode: 'insensitive' },
      };
    }

    if (landlordName) {
      where.landlord = {
        name: { contains: landlordName, mode: 'insensitive' },
      };
    }

    if (propertyLocation) {
      where.property = {
        location: { contains: propertyLocation, mode: 'insensitive' },
      };
    }

    // Ejecutar consulta y conteo en paralelo
    const [data, total] = await this.prisma.$transaction([
      this.prisma.rentalContract.findMany({
        where,
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
        skip,
        take: limit,
      }),
      this.prisma.rentalContract.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
        limit,
      },
    };
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
    const currentContract = await this.findOne(id);

    // Preparar fechas para validación y cálculo
    // Usamos las nuevas si vienen en el DTO, si no las que ya existen
    const startDateStr = updateContratoDto.startDate ?? currentContract.startDate.toISOString();
    const endDateStr = updateContratoDto.endDate ?? currentContract.endDate.toISOString();
    const frequency = updateContratoDto.adjustmentFrequency !== undefined
      ? updateContratoDto.adjustmentFrequency
      : currentContract.adjustmentFrequency;

    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    // Validar coherencia solo si se está tocando alguna fecha
    if (updateContratoDto.startDate || updateContratoDto.endDate) {
      this.validateDates(startDate, endDate);
    }

    let nextAdjustmentDate = currentContract.nextAdjustmentDate;

    // Recalcular nextAdjustmentDate si cambia start date o la frecuencia
    // OJO: Si cambia el startDate, por regla de negocio debemos actualizar el nextAdjustmentDate inicial
    if (updateContratoDto.startDate || updateContratoDto.adjustmentFrequency) {
      nextAdjustmentDate = this.calculateNextAdjustmentDate(startDate, endDate, frequency);
    }

    return this.prisma.rentalContract.update({
      where: { id },
      data: {
        ...updateContratoDto,
        nextAdjustmentDate,
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
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Validate existence
    return this.prisma.rentalContract.delete({
      where: { id },
    });
  }
}
