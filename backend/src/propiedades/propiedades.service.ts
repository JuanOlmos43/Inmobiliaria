import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePropiedadeDto } from './dto/create-propiedade.dto';
import { UpdatePropiedadeDto } from './dto/update-propiedade.dto';
import { QueryPropiedadesDto } from './dto/query-propiedades.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

import { StorageService } from '../storage/storage.service';
import { ConfirmImageUploadDto } from './dto/property-images.dto';

@Injectable()
export class PropiedadesService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
  ) { }

  async create(createPropiedadeDto: CreatePropiedadeDto) {
    const {
      features,
      calleId,
      localidadId,
      provinciaId,
      ownerId,
      agentId,
      ...propertyData
    } = createPropiedadeDto;

    return this.prisma.property.create({
      data: {
        ...propertyData,
        calle: calleId ? { connect: { id: calleId } } : undefined,
        localidad: localidadId ? { connect: { id: localidadId } } : undefined,
        provincia: provinciaId ? { connect: { id: provinciaId } } : undefined,
        owner: ownerId ? { connect: { id: ownerId } } : undefined,
        agent: agentId ? { connect: { id: agentId } } : undefined,
        features: (features && features.length > 0) ? {
          create: features.map(name => ({ name }))
        } : undefined,
      },
      include: {
        localidad: true,
        calle: true,
        features: true, // Incluir features en la respuesta
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

    if (query.search) {
      where.locationText = {
        contains: query.search,
        mode: 'insensitive',
      };
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

    const { features, ...propertyData } = updatePropiedadeDto;

    // Si vienen features, usamos una transacción para limpiar las viejas e insertar las nuevas
    // O simplemente usamos la capacidad de nested writes de prisma en el update si queremos reemplazar todo

    // Para simplificar y asegurar consistencia: si se envían features, reemplazamos todas.
    const updateData: any = { ...propertyData };

    if (features !== undefined) {
      updateData.features = {
        deleteMany: {}, // Borra todas las features existentes de esta propiedad
        create: features.map(name => ({ name })), // Crea las nuevas
      };
    }

    return this.prisma.property.update({
      where: { id },
      data: updateData,
      include: {
        localidad: true,
        calle: true,
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
  }

  async remove(id: string) {
    // Verificar que la propiedad existe
    await this.findOne(id);

    // 1. Eliminar imágenes del bucket
    // Asumimos que la carpeta tiene el mismo nombre que el ID de la propiedad
    try {
      await this.storageService.deleteFolder(id);
    } catch (error) {
      console.error(`Warning: Failed to cleanup storage for property ${id}`, error);
      // We continue to delete the record even if storage fails, or we could throw.
      // Usually better to ensure DB consistency.
    }

    // 2. Eliminar registro de la DB (Cascade borrará images y features)
    return this.prisma.property.delete({
      where: { id },
    });
  }

  async generateUploadUrl(id: string, filename: string) {
    // Verificar que la propiedad existe
    await this.findOne(id);

    // Calcular el orden para la imagen (count + 1)
    const count = await this.prisma.propertyImage.count({
      where: { propertyId: id },
    });
    const nextOrder = count + 1;

    // Obtener extensión del archivo
    const ext = filename.split('.').pop();
    // Definir path: {propiedad_id}/{orden}.{ext}
    const path = `${id}/${nextOrder}.${ext}`;

    const { signedUrl, token } = await this.storageService.getSignedUploadUrl(path);

    return {
      uploadUrl: signedUrl,
      path,
      token,
      order: nextOrder,
      filename: `${nextOrder}.${ext}`,
    };
  }

  async confirmImageUpload(id: string, confirmDto: ConfirmImageUploadDto) {
    // 1. Verificar que la propiedad existe
    await this.findOne(id);

    // 2. Obtener la URL pública desde el StorageService
    // Asumimos que el path enviado es relativo al bucket (ej: "uuid/1.jpg")
    const publicUrl = this.storageService.getPublicUrl(confirmDto.path);

    // 3. Determinar el orden si no se envió
    let order = confirmDto.order;
    if (order === undefined) {
      const count = await this.prisma.propertyImage.count({
        where: { propertyId: id },
      });
      order = count + 1;
    }

    // 4. Crear el registro en la base de datos
    const newImage = await this.prisma.propertyImage.create({
      data: {
        url: publicUrl,
        order: order,
        propertyId: id,
      },
    });

    // 5. Si es la primera imagen (order 1), actualizar property.mainImage
    if (order === 1) {
      await this.prisma.property.update({
        where: { id },
        data: { mainImage: publicUrl },
      });
    }

    return newImage;
  }
}
