import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateContratoDto } from './dto/create-contrato.dto';
import { UpdateContratoDto } from './dto/update-contrato.dto';
import { PrismaService } from '../prisma/prisma.service';
import { QueryContratosDto } from './dto/query-contratos.dto';

@Injectable()
export class ContratosService {
  constructor(private prisma: PrismaService) {}

  private addMonths(date: Date, months: number): Date {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
  }

  private validateDates(start: Date, end: Date) {
    if (start >= end) {
      throw new BadRequestException(
        'La fecha de inicio debe ser anterior a la fecha de fin',
      );
    }
  }

  private calculateNextAdjustmentDate(
    startDate: Date,
    endDate: Date,
    frequencyMonths?: number | null,
  ): Date | null {
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

    let nextAdjustmentDate = this.calculateNextAdjustmentDate(
      startDate,
      endDate,
      createContratoDto.adjustmentFrequency,
    );

    // Si el estado inicial no es activo, no debe tener fecha de ajuste
    if (createContratoDto.status && createContratoDto.status !== 'active') {
      nextAdjustmentDate = null;
    }

    return this.prisma.$transaction(async (tx) => {
      const contract = await tx.rentalContract.create({
        data: {
          propertyId: createContratoDto.propertyId,
          tenantId: createContratoDto.tenantId,
          landlordId: createContratoDto.landlordId,
          agentId: createContratoDto.agentId,
          monthlyRent: createContratoDto.monthlyRent,
          deposit: createContratoDto.deposit,
          adjustmentFrequency: createContratoDto.adjustmentFrequency,
          startDate,
          endDate,
          nextAdjustmentDate,
          status: createContratoDto.status || 'active',
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

      // Si el contrato se crea activo, marcar la propiedad como alquilada
      if (!createContratoDto.status || createContratoDto.status === 'active') {
        await tx.property.update({
          where: { id: createContratoDto.propertyId },
          data: { status: 'alquilada' },
        });
      }

      return contract;
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
        OR: [
          { name: { contains: tenantName, mode: 'insensitive' } },
          { email: { contains: tenantName, mode: 'insensitive' } },
        ],
      };
    }

    if (landlordName) {
      where.landlord = {
        OR: [
          { name: { contains: landlordName, mode: 'insensitive' } },
          { email: { contains: landlordName, mode: 'insensitive' } },
        ],
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
        totalPages: Math.ceil(total / limit),
        limit,
      },
    };
  }

  // --- Lógica de Vencimientos y Ajustes Mensuales ---

  private async updateOverdueAdjustments() {
    const today = new Date();
    // Primer día del mes actual
    const startOfCurrentMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1,
    );

    // Buscar contratos con próxima fecha de ajuste anterior a este mes (vencida)
    const contractsToUpdate = await this.prisma.rentalContract.findMany({
      where: {
        nextAdjustmentDate: {
          lt: startOfCurrentMonth,
        },
        status: 'active', // Solo activos
      },
    });

    // Actualizar cada contrato
    for (const contract of contractsToUpdate) {
      if (!contract.adjustmentFrequency || !contract.nextAdjustmentDate)
        continue;

      let nextDate = new Date(contract.nextAdjustmentDate);
      const endDate = new Date(contract.endDate);

      // Sumar frecuencia hasta que la fecha sea futura (este mes o después) o supere el fin del contrato
      while (nextDate < startOfCurrentMonth && nextDate <= endDate) {
        nextDate = this.addMonths(nextDate, contract.adjustmentFrequency);
      }

      // Si se pasó del final del contrato, ya no hay próximo ajuste
      const finalNextDate = nextDate > endDate ? null : nextDate;

      // Actualizar en BD
      await this.prisma.rentalContract.update({
        where: { id: contract.id },
        data: { nextAdjustmentDate: finalNextDate },
      });
    }
  }

  async getMonthlyActivity(
    type: 'all' | 'end_contract' | 'adjustment' = 'all',
    search?: string,
    role?: 'tenant' | 'landlord',
  ) {
    // 1. Recalcular fechas desactualizadas primero
    await this.updateOverdueAdjustments();

    // 2. Definir rango del mes actual
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    // Ajustar endOfMonth al final del día
    endOfMonth.setHours(23, 59, 59, 999);

    const where: any = { status: 'active' };
    const dateConditions: any[] = [];

    // Lógica de filtro según el tipo (Fechas)
    if (type === 'end_contract' || type === 'all') {
      dateConditions.push({
        endDate: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      });
    }

    if (type === 'adjustment' || type === 'all') {
      dateConditions.push({
        nextAdjustmentDate: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      });
    }

    if (dateConditions.length > 0) {
      where.OR = dateConditions; // Coincidir con vencimiento O ajuste
    } else {
      return [];
    }

    // 3. Agregar filtro de búsqueda (Nombres/Emails) si existe
    if (search) {
      const searchFilters: any[] = [];

      // Si rol es tenant o no se especificó rol, buscar en tenant
      if (!role || role === 'tenant') {
        searchFilters.push(
          { tenant: { name: { contains: search, mode: 'insensitive' } } },
          { tenant: { email: { contains: search, mode: 'insensitive' } } },
        );
      }

      // Si rol es landlord o no se especificó rol, buscar en landlord
      if (!role || role === 'landlord') {
        searchFilters.push(
          { landlord: { name: { contains: search, mode: 'insensitive' } } },
          { landlord: { email: { contains: search, mode: 'insensitive' } } },
        );
      }

      // Aplicar filtro combinado con lógica adecuada
      if (searchFilters.length > 0) {
        // Necesitamos asegurar que cumpla con el criterio de fecha (AND)
        // Y además coincida con alguno de los criterios de búsqueda (AND ( ... OR ...))
        where.AND = [{ OR: searchFilters }];
      }
    }

    const contracts = await this.prisma.rentalContract.findMany({
      where,
      include: {
        property: {
          select: { title: true, location: true },
        },
        tenant: {
          select: { name: true, email: true },
        },
        landlord: {
          select: { name: true, email: true },
        },
        agent: {
          select: { name: true, email: true },
        },
      },
      orderBy: {
        endDate: 'asc',
      },
    });

    // Mapear respuesta para indicar qué evento ocurre (Vencimiento o Ajuste)
    return contracts.map((c) => {
      const isEnding = c.endDate >= startOfMonth && c.endDate <= endOfMonth;
      const isAdjusting =
        c.nextAdjustmentDate &&
        c.nextAdjustmentDate >= startOfMonth &&
        c.nextAdjustmentDate <= endOfMonth;

      return {
        ...c,
        eventType:
          isEnding && isAdjusting
            ? 'both'
            : isEnding
              ? 'end_contract'
              : 'adjustment',
      };
    });
  }

  /**
   * Obtiene estadísticas de la operación de alquileres.
   *
   * @returns Objeto con métricas de contratos.
   * @example
   * {
   *   "monthly": { "new": 8, "expiring": 3 },
   *   "status": { "active": 45, "expired": 120 }
   * }
   */
  async getStats() {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    const [newThisMonth, active, expired, expiringThisMonth] =
      await Promise.all([
        // Contratos de alquiler nuevos este mes (por fecha de inicio)
        this.prisma.rentalContract.count({
          where: {
            startDate: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
        }),
        // Activos totales
        this.prisma.rentalContract.count({ where: { status: 'active' } }),
        // Expirados totales
        this.prisma.rentalContract.count({ where: { status: 'expired' } }),
        // Vencen este mes
        this.prisma.rentalContract.count({
          where: {
            endDate: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
        }),
      ]);

    return {
      monthly: {
        new: newThisMonth,
        expiring: expiringThisMonth,
      },
      status: {
        active,
        expired,
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
    const startDateStr =
      updateContratoDto.startDate ?? currentContract.startDate.toISOString();
    const endDateStr =
      updateContratoDto.endDate ?? currentContract.endDate.toISOString();
    const frequency =
      updateContratoDto.adjustmentFrequency !== undefined
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
      nextAdjustmentDate = this.calculateNextAdjustmentDate(
        startDate,
        endDate,
        frequency,
      );
    }

    let status = updateContratoDto.status ?? currentContract.status;

    // Recalcular estado para evitar inconsistencias de fechas
    const now = new Date();
    // Si la fecha de fin es anterior a hoy, debe estar vencido (salvo que sea terminated)
    if (endDate < now && status !== 'terminated') {
      status = 'expired';
    }
    // Si la fecha de fin es futura y estaba vencido, pasa a activo
    else if (endDate >= now && status === 'expired') {
      status = 'active';
    }

    // SI el estado final es terminado o vencido, no debe tener proximo ajuste
    if (status === 'terminated' || status === 'expired') {
      nextAdjustmentDate = null;
    }

    return this.prisma.rentalContract.update({
      where: { id },
      data: {
        ...updateContratoDto,
        startDate,
        endDate,
        nextAdjustmentDate,
        status,
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

  async findLandlordRentedProperties(landlordId: string) {
    const contracts = await this.prisma.rentalContract.findMany({
      where: {
        landlordId,
        status: 'active',
      },
      include: {
        property: {
          include: {
            localidad: true,
            calle: true,
            images: {
              orderBy: {
                order: 'asc',
              },
              take: 1,
            },
          },
        },
        tenant: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return contracts.map((contract) => {
      const adjustmentScheduledDates: Date[] = [];
      if (
        contract.adjustmentFrequency &&
        contract.startDate &&
        contract.endDate
      ) {
        const end = new Date(contract.endDate);
        const next = new Date(contract.startDate);
        // First adjustment is after frequency months
        next.setMonth(next.getMonth() + contract.adjustmentFrequency);

        while (next <= end) {
          adjustmentScheduledDates.push(new Date(next));
          next.setMonth(next.getMonth() + contract.adjustmentFrequency);
        }
      }

      return {
        ...contract,
        adjustmentScheduledDates,
      };
    });
  }

  async findTenantRentals(tenantId: string) {
    const contracts = await this.prisma.rentalContract.findMany({
      where: {
        tenantId,
      },
      include: {
        property: {
          include: {
            localidad: true,
            calle: true,
            images: {
              orderBy: {
                order: 'asc',
              },
              take: 1,
            },
          },
        },
        landlord: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: [
        { status: 'asc' }, // active first
        { endDate: 'asc' }, // soonest expiring first
      ],
    });

    return contracts.map((contract) => {
      const adjustmentScheduledDates: Date[] = [];
      if (
        contract.adjustmentFrequency &&
        contract.startDate &&
        contract.endDate
      ) {
        const end = new Date(contract.endDate);
        const next = new Date(contract.startDate);
        // First adjustment is after frequency months
        next.setMonth(next.getMonth() + contract.adjustmentFrequency);

        while (next <= end) {
          adjustmentScheduledDates.push(new Date(next));
          next.setMonth(next.getMonth() + contract.adjustmentFrequency);
        }
      }

      return {
        ...contract,
        adjustmentScheduledDates,
      };
    });
  }

  async remove(id: string) {
    const contract = await this.findOne(id);

    return this.prisma.$transaction(async (tx) => {
      // 1. Terminar el contrato (soft delete)
      const terminated = await tx.rentalContract.update({
        where: { id },
        data: {
          status: 'terminated',
          actualEndDate: new Date(),
        },
      });

      // 2. Volver a poner la propiedad como activa
      await tx.property.update({
        where: { id: contract.propertyId },
        data: { status: 'activa' },
      });

      return terminated;
    });
  }
}
