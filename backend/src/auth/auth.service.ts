import {
    Injectable,
    UnauthorizedException,
    ConflictException,
    ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { User, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    /**
     * Validates user credentials (used by LocalStrategy)
     */
    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            return null;
        }

        // Validate user status
        this.validateUserStatus(user);

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return null;
        }

        return user;
    }

    /**
     * Validates that user is active
     */
    validateUserStatus(user: User): void {
        if (user.status === UserStatus.suspended) {
            throw new ForbiddenException('Usuario suspendido');
        }
        if (user.status === UserStatus.inactive) {
            throw new ForbiddenException('Usuario inactivo');
        }
    }

    /**
     * Generates access and refresh tokens for a user
     */
    async login(user: User) {
        const payload = { email: user.email, sub: user.id, role: user.role };

        // Generate access token
        const accessToken = this.jwtService.sign(payload);

        // Generate refresh token with different secret
        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
            expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
        } as any);

        // Hash and store refresh token in database
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

        await this.prisma.refreshToken.create({
            data: {
                token: hashedRefreshToken,
                userId: user.id,
                expiresAt,
            },
        });

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    }

    /**
     * Registers a new user (only accessible by admin/agent)
     */
    async register(dto: RegisterDto): Promise<Omit<User, 'password'>> {
        // Check if user already exists
        const existingUser = await this.usersService.findByEmail(dto.email);
        if (existingUser) {
            throw new ConflictException('El email ya está registrado');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        // Create user
        const user = await this.usersService.create({
            email: dto.email,
            password: hashedPassword,
            name: dto.name,
            phone: dto.phone,
            role: dto.role,
        });

        // Remove password from response
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    /**
     * Refreshes access token using refresh token
     */
    async refreshTokens(refreshToken: string) {
        try {
            // Verify refresh token
            const payload = this.jwtService.verify(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET,
            });

            // Find all refresh tokens for this user
            const storedTokens = await this.prisma.refreshToken.findMany({
                where: {
                    userId: payload.sub,
                    expiresAt: { gte: new Date() }, // Not expired
                },
            });

            // Verify that the refresh token exists in database
            let tokenFound = false;
            for (const storedToken of storedTokens) {
                const isValid = await bcrypt.compare(refreshToken, storedToken.token);
                if (isValid) {
                    tokenFound = true;
                    break;
                }
            }

            if (!tokenFound) {
                throw new UnauthorizedException('Refresh token inválido');
            }

            // Get user
            const user = await this.usersService.findById(payload.sub);
            if (!user) {
                throw new UnauthorizedException('Usuario no encontrado');
            }

            // Validate user status
            this.validateUserStatus(user);

            // Generate new access token
            const newPayload = { email: user.email, sub: user.id, role: user.role };
            const accessToken = this.jwtService.sign(newPayload);

            return {
                access_token: accessToken,
            };
        } catch (error) {
            throw new UnauthorizedException('Refresh token inválido o expirado');
        }
    }

    /**
     * Logs out user by invalidating refresh token
     */
    async logout(userId: string, refreshToken: string): Promise<void> {
        // Find all refresh tokens for this user
        const storedTokens = await this.prisma.refreshToken.findMany({
            where: { userId },
        });

        // Find and delete the matching token
        for (const storedToken of storedTokens) {
            const isValid = await bcrypt.compare(refreshToken, storedToken.token);
            if (isValid) {
                await this.prisma.refreshToken.delete({
                    where: { id: storedToken.id },
                });
                return;
            }
        }
    }
}
