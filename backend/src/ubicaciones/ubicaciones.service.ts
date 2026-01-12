import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProvinciaDto } from './dto/create-provincia.dto';
import { CreateLocalidadDto } from './dto/create-localidad.dto';
import { CreateCalleDto } from './dto/create-calle.dto';
import {
  UpdateProvinciaDto,
  UpdateLocalidadDto,
  UpdateCalleDto,
} from './dto/update-ubicacion.dto';

@Injectable()
export class UbicacionesService {
  constructor(private prisma: PrismaService) { }

  // ==========================================
  // PROVINCIAS
  // ==========================================

  async createProvincia(createProvinciaDto: CreateProvinciaDto) {
    try {
      return await this.prisma.provincia.create({
        data: createProvinciaDto,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          `Ya existe una provincia con el nombre "${createProvinciaDto.nombre}"`,
        );
      }
      throw error;
    }
  }

  async getAllProvincias() {
    return this.prisma.provincia.findMany({
      orderBy: {
        nombre: 'asc',
      },
      include: {
        _count: {
          select: {
            localidades: true,
          },
        },
      },
    });
  }

  async getProvinciaById(id: string) {
    const provincia = await this.prisma.provincia.findUnique({
      where: { id },
      include: {
        localidades: {
          orderBy: {
            nombre: 'asc',
          },
          include: {
            _count: {
              select: {
                calles: true,
              },
            },
          },
        },
      },
    });

    if (!provincia) {
      throw new NotFoundException(`Provincia con ID ${id} no encontrada`);
    }

    return provincia;
  }

  async updateProvincia(id: string, updateProvinciaDto: UpdateProvinciaDto) {
    await this.getProvinciaById(id); // Verifica que existe

    try {
      return await this.prisma.provincia.update({
        where: { id },
        data: updateProvinciaDto,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          `Ya existe una provincia con el nombre "${updateProvinciaDto.nombre}"`,
        );
      }
      throw error;
    }
  }

  async deleteProvincia(id: string) {
    await this.getProvinciaById(id); // Verifica que existe

    return this.prisma.provincia.delete({
      where: { id },
    });
  }

  // ==========================================
  // LOCALIDADES
  // ==========================================

  async createLocalidad(createLocalidadDto: CreateLocalidadDto) {
    // Verificar que la provincia existe
    await this.getProvinciaById(createLocalidadDto.provinciaId);

    try {
      return await this.prisma.localidad.create({
        data: createLocalidadDto,
        include: {
          provincia: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          `Ya existe una localidad con el nombre "${createLocalidadDto.nombre}" en esta provincia`,
        );
      }
      throw error;
    }
  }

  async getLocalidadesByProvincia(provinciaId: string) {
    // Verificar que la provincia existe
    await this.getProvinciaById(provinciaId);

    return this.prisma.localidad.findMany({
      where: { provinciaId },
      orderBy: {
        nombre: 'asc',
      },
      include: {
        _count: {
          select: {
            calles: true,
          },
        },
      },
    });
  }

  async getLocalidadById(id: string) {
    const localidad = await this.prisma.localidad.findUnique({
      where: { id },
      include: {
        provincia: true,
        calles: {
          orderBy: {
            nombre: 'asc',
          },
        },
      },
    });

    if (!localidad) {
      throw new NotFoundException(`Localidad con ID ${id} no encontrada`);
    }

    return localidad;
  }

  async updateLocalidad(id: string, updateLocalidadDto: UpdateLocalidadDto) {
    await this.getLocalidadById(id); // Verifica que existe

    try {
      return await this.prisma.localidad.update({
        where: { id },
        data: updateLocalidadDto,
        include: {
          provincia: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          `Ya existe una localidad con el nombre "${updateLocalidadDto.nombre}" en esta provincia`,
        );
      }
      throw error;
    }
  }

  async deleteLocalidad(id: string) {
    await this.getLocalidadById(id); // Verifica que existe

    return this.prisma.localidad.delete({
      where: { id },
    });
  }

  // ==========================================
  // CALLES
  // ==========================================

  async createCalle(createCalleDto: CreateCalleDto) {
    // Verificar que la localidad existe
    await this.getLocalidadById(createCalleDto.localidadId);

    try {
      return await this.prisma.calle.create({
        data: createCalleDto,
        include: {
          localidad: {
            include: {
              provincia: true,
            },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          `Ya existe una calle con el nombre "${createCalleDto.nombre}" en esta localidad`,
        );
      }
      throw error;
    }
  }

  async getCallesByLocalidad(localidadId: string) {
    // Verificar que la localidad existe
    await this.getLocalidadById(localidadId);

    return this.prisma.calle.findMany({
      where: { localidadId },
      orderBy: {
        nombre: 'asc',
      },
    });
  }

  async getCalleById(id: string) {
    const calle = await this.prisma.calle.findUnique({
      where: { id },
      include: {
        localidad: {
          include: {
            provincia: true,
          },
        },
      },
    });

    if (!calle) {
      throw new NotFoundException(`Calle con ID ${id} no encontrada`);
    }

    return calle;
  }

  async updateCalle(id: string, updateCalleDto: UpdateCalleDto) {
    await this.getCalleById(id); // Verifica que existe

    try {
      return await this.prisma.calle.update({
        where: { id },
        data: updateCalleDto,
        include: {
          localidad: {
            include: {
              provincia: true,
            },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          `Ya existe una calle con el nombre "${updateCalleDto.nombre}" en esta localidad`,
        );
      }
      throw error;
    }
  }

  async deleteCalle(id: string) {
    await this.getCalleById(id); // Verifica que existe

    return this.prisma.calle.delete({
      where: { id },
    });
  }
}
