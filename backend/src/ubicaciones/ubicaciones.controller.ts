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

@Controller('ubicaciones')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class UbicacionesController {
  constructor(private readonly ubicacionesService: UbicacionesService) {}

  // ==========================================
  // PROVINCIAS
  // ==========================================

  @Post('provincias')
  createProvincia(@Body() createProvinciaDto: CreateProvinciaDto) {
    return this.ubicacionesService.createProvincia(createProvinciaDto);
  }

  @Get('provincias')
  getAllProvincias() {
    return this.ubicacionesService.getAllProvincias();
  }

  @Get('provincias/:id')
  getProvinciaById(@Param('id') id: string) {
    return this.ubicacionesService.getProvinciaById(id);
  }

  @Patch('provincias/:id')
  updateProvincia(
    @Param('id') id: string,
    @Body() updateProvinciaDto: UpdateProvinciaDto,
  ) {
    return this.ubicacionesService.updateProvincia(id, updateProvinciaDto);
  }

  @Delete('provincias/:id')
  deleteProvincia(@Param('id') id: string) {
    return this.ubicacionesService.deleteProvincia(id);
  }

  // Endpoint jerárquico: localidades de una provincia
  @Get('provincias/:provinciaId/localidades')
  getLocalidadesByProvincia(@Param('provinciaId') provinciaId: string) {
    return this.ubicacionesService.getLocalidadesByProvincia(provinciaId);
  }

  // ==========================================
  // LOCALIDADES
  // ==========================================

  @Post('localidades')
  createLocalidad(@Body() createLocalidadDto: CreateLocalidadDto) {
    return this.ubicacionesService.createLocalidad(createLocalidadDto);
  }

  @Get('localidades/:id')
  getLocalidadById(@Param('id') id: string) {
    return this.ubicacionesService.getLocalidadById(id);
  }

  @Patch('localidades/:id')
  updateLocalidad(
    @Param('id') id: string,
    @Body() updateLocalidadDto: UpdateLocalidadDto,
  ) {
    return this.ubicacionesService.updateLocalidad(id, updateLocalidadDto);
  }

  @Delete('localidades/:id')
  deleteLocalidad(@Param('id') id: string) {
    return this.ubicacionesService.deleteLocalidad(id);
  }

  // Endpoint jerárquico: calles de una localidad
  @Get('localidades/:localidadId/calles')
  getCallesByLocalidad(@Param('localidadId') localidadId: string) {
    return this.ubicacionesService.getCallesByLocalidad(localidadId);
  }

  // ==========================================
  // CALLES
  // ==========================================

  @Post('calles')
  createCalle(@Body() createCalleDto: CreateCalleDto) {
    return this.ubicacionesService.createCalle(createCalleDto);
  }

  @Get('calles/:id')
  getCalleById(@Param('id') id: string) {
    return this.ubicacionesService.getCalleById(id);
  }

  @Patch('calles/:id')
  updateCalle(@Param('id') id: string, @Body() updateCalleDto: UpdateCalleDto) {
    return this.ubicacionesService.updateCalle(id, updateCalleDto);
  }

  @Delete('calles/:id')
  deleteCalle(@Param('id') id: string) {
    return this.ubicacionesService.deleteCalle(id);
  }
}
