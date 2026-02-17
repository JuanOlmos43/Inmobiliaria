import { Controller, Get, UseGuards } from '@nestjs/common';
import { GerenciaService } from './gerencia.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

/**
 * Controller para el dashboard de Gerencia
 * Proporciona endpoints para estadísticas y métricas del negocio
 */
@Controller('gerencia')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GerenciaController {
  constructor(private readonly gerenciaService: GerenciaService) {}

  /**
   * GET /gerencia/dashboard
   * Obtiene todas las estadísticas del dashboard de gerencia
   * Incluye: stats, activity (12 meses), y top 5 agentes
   * 
   * Acceso: Solo Gerencia y Administrador
   */
  @Get('dashboard')
  @Roles(UserRole.Gerencia)
  async getDashboard() {
    return this.gerenciaService.getDashboardData();
  }
}
