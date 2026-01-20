import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePropiedadeDto } from './dto/create-propiedade.dto';
import { UpdatePropiedadeDto } from './dto/update-propiedade.dto';
import { QueryPropiedadesDto } from './dto/query-propiedades.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PropiedadesService {
  constructor(private prisma: PrismaService) {}

  async create(createPropiedadeDto: CreatePropiedadeDto) {
    return this.prisma.property.create({
      data: createPropiedadeDto,
      include: {
        localidad: true,
        calle: true,
        owner: {
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
    });
  }

  async findAll(query: QueryPropiedadesDto) {
    const {
      propertyType,
      listingType,
      status,
      localidadId,
      minPrice,
      maxPrice,
      minBedrooms,
      minBathrooms,
      minArea,
      page = 1,
      limit = 10,
    } = query;

    // Construir filtros dinámicamente
    const where: Prisma.PropertyWhereInput = {};

    if (propertyType) where.propertyType = propertyType;
    if (listingType) where.listingType = listingType;
    if (status) where.status = status;
    if (localidadId) where.localidadId = localidadId;

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (minBedrooms !== undefined) {
      where.bedrooms = { gte: minBedrooms };
    }

    if (minBathrooms !== undefined) {
      where.bathrooms = { gte: minBathrooms };
    }

    if (minArea !== undefined) {
      where.area = { gte: minArea };
    }

    // Calcular paginación
    const skip = (page - 1) * limit;

    // Ejecutar query con paginación
    const [properties, total] = await Promise.all([
      this.prisma.property.findMany({
        where,
        skip,
        take: limit,
        include: {
          localidad: {
            include: {
              provincia: true,
            },
          },
          calle: true,
          owner: {
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
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.property.count({ where }),
    ]);

    return {
      data: properties,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
      include: {
        localidad: {
          include: {
            provincia: true,
          },
        },
        calle: true,
        images: {
          orderBy: {
            order: 'asc',
          },
        },
        features: true,
        owner: {
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
    });

    if (!property) {
      throw new NotFoundException(`Propiedad con ID ${id} no encontrada`);
    }

    return property;
  }

  async update(id: string, updatePropiedadeDto: UpdatePropiedadeDto) {
    // Verificar que la propiedad existe
    await this.findOne(id);

    return this.prisma.property.update({
      where: { id },
      data: updatePropiedadeDto,
      include: {
        localidad: true,
        calle: true,
        owner: {
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
    });
  }

  async remove(id: string) {
    // Verificar que la propiedad existe
    await this.findOne(id);

    // Soft delete: cambiar status a archivada
    return this.prisma.property.update({
      where: { id },
      data: {
        status: 'archivada',
      },
    });
  }
}
