import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ContratosService } from './contratos.service';
import { CreateContratoDto } from './dto/create-contrato.dto';
import { UpdateContratoDto } from './dto/update-contrato.dto';
import { QueryContratosDto } from './dto/query-contratos.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import type { User } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('contratos')
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class ContratosController {
  constructor(private readonly contratosService: ContratosService) {}

  @Get('stats')
  getStats() {
    return this.contratosService.getStats();
  }

  @Get('landlord/rented')
  @Roles(UserRole.Propietario)
  getLandlordRentedProperties(@CurrentUser() user: User) {
    return this.contratosService.findLandlordRentedProperties(user.id);
  }

  @Get('tenant/rented')
  @Roles(UserRole.Inquilino)
  getTenantRentals(@CurrentUser() user: User) {
    return this.contratosService.findTenantRentals(user.id);
  }

  @Get('dashboard/expirations')
  getMonthlyActivity(
    @Query('type') type?: 'all' | 'end_contract' | 'adjustment',
    @Query('search') search?: string,
    @Query('role') role?: 'tenant' | 'landlord',
  ) {
    return this.contratosService.getMonthlyActivity(type, search, role);
  }

  @Post()
  @Roles(UserRole.Agente)
  create(@Body() createContratoDto: CreateContratoDto) {
    return this.contratosService.create(createContratoDto);
  }

  @Get()
  findAll(@Query() query: QueryContratosDto) {
    return this.contratosService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contratosService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.Agente)
  update(
    @Param('id') id: string,
    @Body() updateContratoDto: UpdateContratoDto,
  ) {
    return this.contratosService.update(id, updateContratoDto);
  }

  @Delete(':id')
  @Roles(UserRole.Agente)
  remove(@Param('id') id: string) {
    return this.contratosService.remove(id);
  }
}
