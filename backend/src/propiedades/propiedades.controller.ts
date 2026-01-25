
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
} from '@nestjs/common';
import { PropiedadesService } from './propiedades.service';
import { CreatePropiedadeDto } from './dto/create-propiedade.dto';
import { UpdatePropiedadeDto } from './dto/update-propiedade.dto';
import { QueryPropiedadesDto } from './dto/query-propiedades.dto';
import { GenerateUploadUrlDto } from './dto/generate-upload-url.dto';

@Controller('propiedades')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class PropiedadesController {
  constructor(private readonly propiedadesService: PropiedadesService) { }

  @Post()
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
  update(
    @Param('id') id: string,
    @Body() updatePropiedadeDto: UpdatePropiedadeDto,
  ) {
    return this.propiedadesService.update(id, updatePropiedadeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propiedadesService.remove(id);
  }

  @Post(':id/upload-url')
  generateUploadUrl(
    @Param('id') id: string,
    @Body() generateUploadUrlDto: GenerateUploadUrlDto,
  ) {
    return this.propiedadesService.generateUploadUrl(
      id,
      generateUploadUrlDto.filename,
    );
  }
}
