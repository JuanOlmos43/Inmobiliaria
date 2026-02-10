import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ValidationPipe,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { PropiedadesService } from './propiedades.service';
import { CreatePropiedadeDto } from './dto/create-propiedade.dto';
import { UpdatePropiedadeDto } from './dto/update-propiedade.dto';
import { QueryPropiedadesDto } from './dto/query-propiedades.dto';
import {
  GenerateUploadUrlDto,
  ConfirmImageUploadDto,
} from './dto/property-images.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

import { Public } from '../auth/decorators/public.decorator';

@Controller('propiedades')
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class PropiedadesController {
  constructor(private readonly propiedadesService: PropiedadesService) {}

  @Post()
  @Roles(UserRole.Agente)
  async create(@Body() createPropiedadeDto: CreatePropiedadeDto) {
    return await this.propiedadesService.create(createPropiedadeDto);
  }

  @Get('stats')
  getStats() {
    return this.propiedadesService.getStats();
  }

  @Get('featured')
  @Public()
  getFeaturedProperties() {
    return this.propiedadesService.getFeaturedProperties();
  }

  @Get('public')
  @Public()
  findPublic(@Query() query: QueryPropiedadesDto) {
    return this.propiedadesService.findAll(query, true);
  }

  @Get()
  findAll(@Query() query: QueryPropiedadesDto) {
    return this.propiedadesService.findAll(query, false);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propiedadesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.Agente)
  update(
    @Param('id') id: string,
    @Body() updatePropiedadeDto: UpdatePropiedadeDto,
  ) {
    return this.propiedadesService.update(id, updatePropiedadeDto);
  }

  @Delete(':id')
  @Roles(UserRole.Agente)
  remove(@Param('id') id: string) {
    return this.propiedadesService.remove(id);
  }

  @Post(':id/upload-url')
  @Roles(UserRole.Agente)
  generateUploadUrl(
    @Param('id') id: string,
    @Body() generateUploadUrlDto: GenerateUploadUrlDto,
  ) {
    return this.propiedadesService.generateUploadUrl(
      id,
      generateUploadUrlDto.filename,
    );
  }

  @Post(':id/images')
  @Roles(UserRole.Agente)
  confirmImageUpload(
    @Param('id') id: string,
    @Body() confirmImageUploadDto: ConfirmImageUploadDto,
  ) {
    return this.propiedadesService.confirmImageUpload(
      id,
      confirmImageUploadDto,
    );
  }
}
