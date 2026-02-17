import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PropertyStatus, PropertyListingType, ContractStatus } from '@prisma/client';

/**
 * Service para el dashboard de Gerencia
 * Calcula todas las estadísticas y métricas del negocio
 */
@Injectable()
export class GerenciaService {
  constructor(private prisma: PrismaService) {}

  /**
   * Obtiene todos los datos del dashboard en una sola llamada
   */
  async getDashboardData() {
    const [stats, activity, topAgents] = await Promise.all([
      this.getStats(),
      this.getMonthlyActivity(),
      this.getTopAgents(),
    ]);

    return {
      stats,
      activity,
      topAgents,
    };
  }

  /**
   * Calcula las estadísticas principales del dashboard
   */
  private async getStats() {
    const [inventory, sales, rentals] = await Promise.all([
      this.getInventoryStats(),
      this.getSalesStats(),
      this.getRentalsStats(),
    ]);

    return {
      inventory,
      sales,
      rentals,
    };
  }

  /**
   * Estadísticas de Inventario Total
   */
  private async getInventoryStats() {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [total, newMonth, active, paused, reserved, totalValueResult] = await Promise.all([
      // Total de propiedades
      this.prisma.property.count(),

      // Nuevas este mes
      this.prisma.property.count({
        where: { createdAt: { gte: firstDayOfMonth } },
      }),

      // Activas
      this.prisma.property.count({
        where: { status: PropertyStatus.activa },
      }),

      // Pausadas
      this.prisma.property.count({
        where: { status: PropertyStatus.pausada },
      }),

      // Reservadas (consideramos alquiladas como reservadas)
      this.prisma.property.count({
        where: { status: PropertyStatus.alquilada },
      }),

      // Valor total del inventario (suma de precios de propiedades activas)
      this.prisma.property.aggregate({
        where: { status: PropertyStatus.activa },
        _sum: { price: true },
      }),
    ]);

    return {
      total,
      newMonth,
      active,
      paused,
      reserved,
      totalValue: totalValueResult._sum.price || 0,
    };
  }

  /**
   * Estadísticas de Ventas
   */
  private async getSalesStats() {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      total,
      available,
      reserved,
      soldMonth,
      totalValueResult,
      avgTimeMarket,
    ] = await Promise.all([
      // Total de propiedades en venta
      this.prisma.property.count({
        where: { listingType: PropertyListingType.venta },
      }),

      // Disponibles (activas)
      this.prisma.property.count({
        where: {
          listingType: PropertyListingType.venta,
          status: PropertyStatus.activa,
        },
      }),

      // Reservadas (alquiladas - aunque es venta, puede estar en proceso)
      this.prisma.property.count({
        where: {
          listingType: PropertyListingType.venta,
          status: PropertyStatus.alquilada,
        },
      }),

      // Vendidas este mes
      this.prisma.property.count({
        where: {
          listingType: PropertyListingType.venta,
          status: PropertyStatus.vendida,
          updatedAt: { gte: firstDayOfMonth },
        },
      }),

      // Valor total de propiedades en venta activas
      this.prisma.property.aggregate({
        where: {
          listingType: PropertyListingType.venta,
          status: PropertyStatus.activa,
        },
        _sum: { price: true },
      }),

      // Tiempo promedio en el mercado (en días)
      this.calculateAvgTimeToSell(),
    ]);

    return {
      total,
      available,
      reserved,
      soldMonth,
      avgTimeMarket,
      totalValue: totalValueResult._sum.price || 0,
    };
  }

  /**
   * Estadísticas de Alquileres
   */
  private async getRentalsStats() {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const [
      total,
      available,
      activeContracts,
      newContractsMonth,
      expiringContractsMonth,
      totalValueResult,
      avgTimeMarket,
    ] = await Promise.all([
      // Total de propiedades en alquiler
      this.prisma.property.count({
        where: { listingType: PropertyListingType.alquiler },
      }),

      // Disponibles (activas y no alquiladas)
      this.prisma.property.count({
        where: {
          listingType: PropertyListingType.alquiler,
          status: PropertyStatus.activa,
        },
      }),

      // Contratos activos
      this.prisma.rentalContract.count({
        where: { status: ContractStatus.active },
      }),

      // Nuevos contratos este mes
      this.prisma.rentalContract.count({
        where: {
          status: ContractStatus.active,
          startDate: { gte: firstDayOfMonth },
        },
      }),

      // Contratos que vencen este mes
      this.prisma.rentalContract.count({
        where: {
          status: ContractStatus.active,
          endDate: {
            gte: firstDayOfMonth,
            lte: lastDayOfMonth,
          },
        },
      }),

      // Valor total mensual de alquileres activos
      this.prisma.rentalContract.aggregate({
        where: { status: ContractStatus.active },
        _sum: { monthlyRent: true },
      }),

      // Tiempo promedio en el mercado
      this.calculateAvgTimeToRent(),
    ]);

    return {
      total,
      available,
      activeContracts,
      newContractsMonth,
      expiringContractsMonth,
      avgTimeMarket,
      totalValue: totalValueResult._sum.monthlyRent || 0,
    };
  }

  /**
   * Calcula el tiempo promedio (en días) que tarda una propiedad en venderse
   * Aproximación: diferencia entre createdAt y updatedAt de propiedades vendidas
   */
  private async calculateAvgTimeToSell(): Promise<number> {
    const soldProperties = await this.prisma.property.findMany({
      where: {
        listingType: PropertyListingType.venta,
        status: PropertyStatus.vendida,
      },
      select: {
        createdAt: true,
        updatedAt: true,
      },
      take: 50, // Últimas 50 propiedades vendidas para el cálculo
    });

    if (soldProperties.length === 0) return 0;

    const totalDays = soldProperties.reduce((sum, property) => {
      const days = Math.floor(
        (property.updatedAt.getTime() - property.createdAt.getTime()) /
          (1000 * 60 * 60 * 24),
      );
      return sum + days;
    }, 0);

    return Math.round(totalDays / soldProperties.length);
  }

  /**
   * Calcula el tiempo promedio (en días) que tarda una propiedad en alquilarse
   */
  private async calculateAvgTimeToRent(): Promise<number> {
    const rentedProperties = await this.prisma.property.findMany({
      where: {
        listingType: PropertyListingType.alquiler,
        status: PropertyStatus.alquilada,
      },
      select: {
        createdAt: true,
        updatedAt: true,
      },
      take: 50,
    });

    if (rentedProperties.length === 0) return 0;

    const totalDays = rentedProperties.reduce((sum, property) => {
      const days = Math.floor(
        (property.updatedAt.getTime() - property.createdAt.getTime()) /
          (1000 * 60 * 60 * 24),
      );
      return sum + days;
    }, 0);

    return Math.round(totalDays / rentedProperties.length);
  }

  /**
   * Obtiene la actividad de los últimos 12 meses
   * Retorna cantidad de propiedades listadas por mes (venta y alquiler)
   */
  private async getMonthlyActivity() {
    const now = new Date();
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    // Obtener todas las propiedades creadas en los últimos 12 meses
    const properties = await this.prisma.property.findMany({
      where: {
        createdAt: { gte: twelveMonthsAgo },
      },
      select: {
        createdAt: true,
        listingType: true,
      },
    });

    // Agrupar por mes y tipo
    const monthlyData = new Map<string, { venta: number; alquiler: number }>();

    // Inicializar los últimos 12 meses
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = this.getMonthKey(date);
      monthlyData.set(monthKey, { venta: 0, alquiler: 0 });
    }

    // Contar propiedades por mes
    properties.forEach((property) => {
      const monthKey = this.getMonthKey(property.createdAt);
      const data = monthlyData.get(monthKey);
      if (data) {
        if (property.listingType === PropertyListingType.venta) {
          data.venta++;
        } else {
          data.alquiler++;
        }
      }
    });

    // Convertir a array con formato esperado por el frontend
    const result: Array<{ month: string; venta: number; alquiler: number }> = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = this.getMonthKey(date);
      const monthName = this.getMonthName(date);
      const data = monthlyData.get(monthKey) || { venta: 0, alquiler: 0 };

      result.push({
        month: monthName,
        venta: data.venta,
        alquiler: data.alquiler,
      });
    }

    return result;
  }

  /**
   * Obtiene el top 5 de agentes por cantidad de contratos activos
   */
  private async getTopAgents() {
    // Agrupar contratos por agente
    const agentContracts = await this.prisma.rentalContract.groupBy({
      by: ['agentId'],
      where: {
        status: ContractStatus.active,
        agentId: { not: null },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 5,
    });

    // Obtener información de los agentes
    const topAgents = await Promise.all(
      agentContracts.map(async (item) => {
        const agent = await this.prisma.user.findUnique({
          where: { id: item.agentId! },
          select: {
            id: true,
            name: true,
          },
        });

        return {
          id: agent?.id || '',
          name: agent?.name || 'Sin nombre',
          contracts: item._count.id,
        };
      }),
    );

    return topAgents;
  }

  /**
   * Genera una clave única para un mes (YYYY-MM)
   */
  private getMonthKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  /**
   * Obtiene el nombre del mes en español abreviado (Ene, Feb, etc.)
   */
  private getMonthName(date: Date): string {
    const monthNames = [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic',
    ];
    return monthNames[date.getMonth()];
  }
}
