import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, UserRole, UserStatus, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export { CreateUserDto, UpdateUserDto };

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async create(data: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
        phone: data.phone,
        role: data.role,
        status: data.status || UserStatus.active,
      },
    });
  }

  async findAll(role?: UserRole, email?: string, search?: string) {
    const where: Prisma.UserWhereInput = {};
    if (role) where.role = role;
    if (email) where.email = { startsWith: email, mode: 'insensitive' };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [{ name: 'asc' }, { email: 'asc' }],
    });
  }

  async update(id: string, data: UpdateUserDto) {
    const updateData = { ...data };

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async getStatistics() {
    /*
    {
      "summary": {
        "total": 100,
        "active": 85,
        "inactive": 10,
        "suspended": 5
      },
      "growth": {
        "newThisMonth": 15,
        "registrationsToday": 3
      },
      "roles": {
        "administrador": 2,
        "agente": 10,
        "gerencia": 3,
        "inquilino": 45,
        "propietario": 40
      }
    }
    */
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      total,
      active,
      inactive,
      suspended,
      newThisMonth,
      registrationsToday,
      rolesGrouped,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { status: UserStatus.active } }),
      this.prisma.user.count({ where: { status: UserStatus.inactive } }),
      this.prisma.user.count({ where: { status: UserStatus.suspended } }),
      this.prisma.user.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),
      this.prisma.user.count({
        where: { createdAt: { gte: today } },
      }),
      this.prisma.user.groupBy({
        by: ['role'],
        _count: {
          role: true,
        },
      }),
    ]);

    // Mapeamos los resultados de los roles a un objeto más fácil de usar
    const roles = {
      administrador: 0,
      agente: 0,
      gerencia: 0,
      inquilino: 0,
      propietario: 0,
    };

    rolesGrouped.forEach((group) => {
      const roleName = group.role.toLowerCase();
      if (roleName in roles) {
        roles[roleName as keyof typeof roles] = group._count.role;
      }
    });

    return {
      summary: {
        total,
        active,
        inactive,
        suspended,
      },
      growth: {
        newThisMonth,
        registrationsToday,
      },
      roles,
    };
  }
}
