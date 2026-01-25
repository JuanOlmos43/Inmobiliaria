
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
import { GenerateUploadUrlDto, ConfirmImageUploadDto } from './dto/property-images.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('propiedades')
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class PropiedadesController {
  constructor(private readonly propiedadesService: PropiedadesService) { }

  @Post()
  @Roles(UserRole.agent)
  create(@Body() createPropiedadeDto: CreatePropiedadeDto) {
    return this.propiedadesService.create(createPropiedadeDto);
  }

  @Get()
  findAll(@Query() query: QueryPropiedadesDto) {
    return this.propiedadesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propiedadesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.agent)
  update(
    @Param('id') id: string,
    @Body() updatePropiedadeDto: UpdatePropiedadeDto,
  ) {
    return this.propiedadesService.update(id, updatePropiedadeDto);
  }

  @Delete(':id')
  @Roles(UserRole.agent)
  remove(@Param('id') id: string) {
    return this.propiedadesService.remove(id);
  }

  @Post(':id/upload-url')
  @Roles(UserRole.agent)
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
  @Roles(UserRole.agent)
  confirmImageUpload(
    @Param('id') id: string,
    @Body() confirmImageUploadDto: ConfirmImageUploadDto,
  ) {
    return this.propiedadesService.confirmImageUpload(id, confirmImageUploadDto);
  }
}
