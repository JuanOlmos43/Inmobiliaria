import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { UbicacionesService } from './ubicaciones.service';
import { CreateProvinciaDto } from './dto/create-provincia.dto';
import { CreateLocalidadDto } from './dto/create-localidad.dto';
import { CreateCalleDto } from './dto/create-calle.dto';
import {
  UpdateProvinciaDto,
  UpdateLocalidadDto,
  UpdateCalleDto,
} from './dto/update-ubicacion.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { Public } from '../auth/decorators/public.decorator';

@Controller('ubicaciones')
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class UbicacionesController {
  constructor(private readonly ubicacionesService: UbicacionesService) {}

  // ==========================================
  // PROVINCIAS
  // ==========================================

  @Post('provincias')
  @Roles(UserRole.Administrador, UserRole.Agente)
  createProvincia(@Body() createProvinciaDto: CreateProvinciaDto) {
    return this.ubicacionesService.createProvincia(createProvinciaDto);
  }

  @Get('provincias')
  @Public()
  getAllProvincias() {
    return this.ubicacionesService.getAllProvincias();
  }

  @Get('provincias/:id')
  @Public()
  getProvinciaById(@Param('id') id: string) {
    return this.ubicacionesService.getProvinciaById(id);
  }

  @Patch('provincias/:id')
  @Roles(UserRole.Administrador, UserRole.Agente)
  updateProvincia(
    @Param('id') id: string,
    @Body() updateProvinciaDto: UpdateProvinciaDto,
  ) {
    return this.ubicacionesService.updateProvincia(id, updateProvinciaDto);
  }

  @Delete('provincias/:id')
  @Roles(UserRole.Administrador, UserRole.Agente)
  deleteProvincia(@Param('id') id: string) {
    return this.ubicacionesService.deleteProvincia(id);
  }

  // Endpoint jerárquico: localidades de una provincia
  @Get('provincias/:provinciaId/localidades')
  @Public()
  getLocalidadesByProvincia(@Param('provinciaId') provinciaId: string) {
    return this.ubicacionesService.getLocalidadesByProvincia(provinciaId);
  }

  // ==========================================
  // LOCALIDADES
  // ==========================================

  @Post('localidades')
  @Roles(UserRole.Administrador, UserRole.Agente)
  createLocalidad(@Body() createLocalidadDto: CreateLocalidadDto) {
    return this.ubicacionesService.createLocalidad(createLocalidadDto);
  }

  @Get('localidades/:id')
  @Public()
  getLocalidadById(@Param('id') id: string) {
    return this.ubicacionesService.getLocalidadById(id);
  }

  @Patch('localidades/:id')
  @Roles(UserRole.Administrador, UserRole.Agente)
  updateLocalidad(
    @Param('id') id: string,
    @Body() updateLocalidadDto: UpdateLocalidadDto,
  ) {
    return this.ubicacionesService.updateLocalidad(id, updateLocalidadDto);
  }

  @Delete('localidades/:id')
  @Roles(UserRole.Administrador, UserRole.Agente)
  deleteLocalidad(@Param('id') id: string) {
    return this.ubicacionesService.deleteLocalidad(id);
  }

  // Endpoint jerárquico: calles de una localidad
  @Get('localidades/:localidadId/calles')
  @Public()
  getCallesByLocalidad(@Param('localidadId') localidadId: string) {
    return this.ubicacionesService.getCallesByLocalidad(localidadId);
  }

  // ==========================================
  // CALLES
  // ==========================================

  @Post('calles')
  @Roles(UserRole.Administrador, UserRole.Agente)
  createCalle(@Body() createCalleDto: CreateCalleDto) {
    return this.ubicacionesService.createCalle(createCalleDto);
  }

  @Get('calles/:id')
  @Public()
  getCalleById(@Param('id') id: string) {
    return this.ubicacionesService.getCalleById(id);
  }

  @Patch('calles/:id')
  @Roles(UserRole.Administrador, UserRole.Agente)
  updateCalle(@Param('id') id: string, @Body() updateCalleDto: UpdateCalleDto) {
    return this.ubicacionesService.updateCalle(id, updateCalleDto);
  }

  @Delete('calles/:id')
  @Roles(UserRole.Administrador, UserRole.Agente)
  deleteCalle(@Param('id') id: string) {
    return this.ubicacionesService.deleteCalle(id);
  }
}
