import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
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

  /**
   * Helper function to add calculated currency field based on listingType
   * Venta -> USD, Alquiler -> ARS
   */
  private addCurrency<T extends { listingType: string }>(
    property: T,
  ): T & { currency: string } {
    return {
      ...property,
      currency: property.listingType === 'venta' ? 'USD' : 'ARS',
    };
  }

  /**
   * Helper function to add currency to an array of properties
   */
  private addCurrencyToMany<T extends { listingType: string }>(
    properties: T[],
  ): Array<T & { currency: string }> {
    return properties.map((p) => this.addCurrency(p));
  }

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

    const property = await this.prisma.property.create({
      data: {
        ...propertyData,
        calle: calleId ? { connect: { id: calleId } } : undefined,
        localidad: localidadId ? { connect: { id: localidadId } } : undefined,
        provincia: provinciaId ? { connect: { id: provinciaId } } : undefined,
        owner: ownerId ? { connect: { id: ownerId } } : undefined,
        agent: agentId ? { connect: { id: agentId } } : undefined,
        features:
          features && features.length > 0
            ? {
              create: features.map((name) => ({ name })),
            }
            : undefined,
      },
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

    return this.addCurrency(property);
  }

  async findAll(query: QueryPropiedadesDto, isPublic: boolean = false) {
    const {
      propertyType,
      listingType,
      status,
      localidadId,
      ownerId,
      contractStatus,
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
    if (localidadId) where.localidadId = localidadId;

    if (isPublic) {
      // En modo público, forzamos status activa y no permitimos filtrar por owner/contratos de forma directa si no es deseado
      where.status = 'activa';
      // Si se quiere filtrar por ownerId en público, se podría permitir, pero generalmente es para propietarios logueados.
      // Dejamos ownerId permitido si se quiere ver propiedades de X agente/dueño, pero status siempre activa.
      if (ownerId) where.ownerId = ownerId;
    } else {
      // Modo interno: permite filtrar por cualquier status
      if (status) where.status = status;
      if (ownerId) where.ownerId = ownerId;

      // contractStatus solo relevante para gestión interna
      if (contractStatus) {
        where.rentalContracts = {
          some: {
            status: contractStatus as any,
          },
        };
      }
    }

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
      where.location = {
        contains: query.search,
        mode: 'insensitive',
      };
    }

    // Calcular paginación
    const skip = (page - 1) * limit;

    // Definir includes según visibilidad
    const ownerSelect = isPublic
      ? {
        id: true,
        name: true,
        // No email/phone for public
      }
      : {
        id: true,
        name: true,
        email: true,
        phone: true,
      };

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
            select: ownerSelect,
          },
          agent: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          // Rental contracts usually not needed for public listing
          rentalContracts: !isPublic
            ? {
              select: {
                id: true,
                startDate: true,
                endDate: true,
                tenant: {
                  select: {
                    name: true,
                  },
                },
              },
              orderBy: {
                endDate: 'desc',
              },
            }
            : undefined,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.property.count({ where }),
    ]);

    return {
      data: this.addCurrencyToMany(properties),
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
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

    return this.addCurrency(property);
  }

  async update(id: string, updatePropiedadeDto: UpdatePropiedadeDto) {
    // Verificar que la propiedad existe
    await this.findOne(id);

    const { features, images, ...propertyData } = updatePropiedadeDto;

    // Si vienen features, usamos una transacción para limpiar las viejas e insertar las nuevas
    // O simplemente usamos la capacidad de nested writes de prisma en el update si queremos reemplazar todo
    // Para simplificar y asegurar consistencia: si se envían features, reemplazamos todas.
    const updateData: Prisma.PropertyUpdateInput = { ...propertyData };

    if (features !== undefined) {
      updateData.features = {
        deleteMany: {}, // Borra todas las features existentes de esta propiedad
        create: features.map((name) => ({ name })), // Crea las nuevas
      };
    }

    // Manejo de imágenes: Si se envía una lista de imágenes, sincronizamos.
    // Principalmente para eliminar las que ya no están en la lista.
    if (images !== undefined) {
      // Obtenemos las imágenes actuales
      const currentImages = await this.prisma.propertyImage.findMany({
        where: { propertyId: id },
      });

      // Identificar imágenes a eliminar (las que están en DB pero no en la nueva lista)
      const imagesToDelete = currentImages.filter(
        (img) => !images.includes(img.url),
      );

      if (imagesToDelete.length > 0) {
        // Eliminar de Storage (Supabase)
        // URL format: .../propiedades/propertyId/filename
        const pathsToDelete = imagesToDelete
          .map((img) => {
            // Asumimos que la URL contiene /propiedades/ y tomamos lo que sigue
            const parts = img.url.split('/propiedades/');
            if (parts.length > 1) {
              return parts[1]; // propertyId/filename
            }
            return null;
          })
          .filter((p): p is string => p !== null);

        if (pathsToDelete.length > 0) {
          try {
            await this.storageService.deleteFiles(pathsToDelete);
          } catch (error) {
            console.error('Error deleting files from storage:', error);
            // No bloqueamos el borrado de BD si falla storage
          }
        }

        await this.prisma.propertyImage.deleteMany({
          where: {
            id: { in: imagesToDelete.map((img) => img.id) },
          },
        });
      }

      // Actualizar el orden de las imágenes restantes según el array recibido
      const updatePromises = images.map((url, index) => {
        const imgRecord = currentImages.find((img) => img.url === url);
        // Solo actualizamos si encontramos la imagen y el orden es diferente (opcional check)
        if (imgRecord) {
          return this.prisma.propertyImage.update({
            where: { id: imgRecord.id },
            data: { order: index + 1 },
          });
        }
        return Promise.resolve();
      });

      await Promise.all(updatePromises);

      // Actualizar mainImage con la primera imagen del nuevo orden
      if (images.length > 0) {
        updateData.mainImage = images[0];
      } else {
        updateData.mainImage = null;
      }
    }

    const updatedProperty = await this.prisma.property.update({
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

    return this.addCurrency(updatedProperty);
  }

  async remove(id: string) {
    // Verificar que la propiedad existe
    await this.findOne(id);

    // 1. Eliminar imágenes del bucket
    // Asumimos que la carpeta tiene el mismo nombre que el ID de la propiedad
    try {
      await this.storageService.deleteFolder(id);
    } catch (error) {
      console.error(
        `Warning: Failed to cleanup storage for property ${id}`,
        error,
      );
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
    // Generar UUID para el nombre del archivo para evitar conflictos
    const fileUuid = randomUUID();
    // Definir path: {propiedad_id}/{uuid}.{ext}
    const path = `${id}/${fileUuid}.${ext}`;

    const { signedUrl, token } =
      await this.storageService.getSignedUploadUrl(path);

    return {
      uploadUrl: signedUrl,
      path,
      token,
      order: nextOrder,
      filename: `${fileUuid}.${ext}`,
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

  /**
   * Obtiene propiedades destacadas para la página principal
   * Retorna hasta 6 propiedades (3 de venta + 3 de alquiler)
   * Solo propiedades activas con imagen principal
   * Ordenadas por fecha de creación (más recientes primero)
   * 
   * @returns Array de propiedades destacadas
   */
  async getFeaturedProperties() {
    // Criterios base: solo propiedades activas con imagen
    const baseWhere: Prisma.PropertyWhereInput = {
      status: 'activa',
      mainImage: {
        not: null, // Solo propiedades que tengan imagen principal
      },
    };

    // Buscar 3 propiedades de VENTA más recientes
    const ventaProperties = await this.prisma.property.findMany({
      where: {
        ...baseWhere,
        listingType: 'venta',
      },
      take: 3, // Límite de 3 propiedades
      orderBy: {
        createdAt: 'desc', // Más recientes primero
      },
      include: {
        localidad: {
          include: {
            provincia: true,
          },
        },
      },
    });

    // Buscar 3 propiedades de ALQUILER más recientes
    const alquilerProperties = await this.prisma.property.findMany({
      where: {
        ...baseWhere,
        listingType: 'alquiler',
      },
      take: 3, // Límite de 3 propiedades
      orderBy: {
        createdAt: 'desc', // Más recientes primero
      },
      include: {
        localidad: {
          include: {
            provincia: true,
          },
        },
      },
    });

    // Combinar ambos arrays (venta + alquiler)
    const allFeatured = [...ventaProperties, ...alquilerProperties];

    // Agregar el campo "currency" a cada propiedad
    // (USD para venta, ARS para alquiler)
    return this.addCurrencyToMany(allFeatured);
  }

  /**
   * Obtiene estadísticas generales del inventario de propiedades.
   * 
   * @returns Objeto con métricas de propiedades.
   * @example
   * {
   *   "total": 150,
   *   "status": { "activa": 120, "pausada": 5 },
   *   "monthly": { "new": 12 },
   *   "listingType": { "venta": 80, "alquiler": 70 }
   * }
   */
  async getStats() {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    const [
      total,
      activa,
      pausada,
      alquilada,
      createdThisMonth,
      venta,
      alquiler
    ] = await Promise.all([
      this.prisma.property.count(),
      this.prisma.property.count({ where: { status: 'activa' } }),
      this.prisma.property.count({ where: { status: 'pausada' } }),
      this.prisma.property.count({ where: { status: 'alquilada' } }),
      this.prisma.property.count({
        where: {
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth,
          }
        }
      }),
      this.prisma.property.count({ where: { listingType: 'venta' } }),
      this.prisma.property.count({ where: { listingType: 'alquiler' } }),
    ]);

    return {
      total,
      status: {
        activa,
        pausada,
        alquilada,
      },
      monthly: {
        new: createdThisMonth
      },
      listingType: {
        venta,
        alquiler,
      },
    };
  }
}
