import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, UserRole, UserStatus } from '@prisma/client';

export interface CreateUserDto {
    email: string;
    password: string;
    name?: string;
    phone?: string;
    role: UserRole;
    status?: UserStatus;
}

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

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
                password: data.password, // Will be hashed by AuthService before calling this
                name: data.name,
                phone: data.phone,
                role: data.role,
                status: data.status || UserStatus.active,
            },
        });
    }
}
