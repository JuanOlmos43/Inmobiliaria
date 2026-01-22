import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import type { User } from '@prisma/client';
import { UserRole } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  /**
   * POST /auth/login
   * Public endpoint for user login
   */
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user as User;
    const tokens = await this.authService.login(user);

    // Set refresh token in httpOnly cookie
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // lax for dev (cross-origin)
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/', // Enviado a todos los endpoints (igual que access_token) - luego pasar a path: '/auth/refresh' es lo correcto que no se envie en esa ruta
    });

    // Set access token in httpOnly cookie
    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // lax for dev (cross-origin)
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: '/', // Sent to all endpoints
    });

    return {
      access_token: tokens.access_token,
    };
  }

  /**
   * POST /auth/register
   * Protected endpoint - only admin and agent can register new users
   */
  @Post('register')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin, UserRole.agent)
  async register(@Body(ValidationPipe) dto: RegisterDto) {
    return this.authService.register(dto);
  }

  /**
   * GET /auth/me
   * Protected endpoint - returns current user profile
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: User) {
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * POST /auth/refresh
   * Public endpoint - refreshes access token using refresh token from cookie
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request) {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
      throw new Error('Refresh token no encontrado');
    }

    return this.authService.refreshTokens(refreshToken);
  }

  /**
   * POST /auth/logout
   * Protected endpoint - invalidates refresh token
   */
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(
    @CurrentUser() user: User,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refresh_token;
    if (refreshToken) {
      await this.authService.logout(user.id, refreshToken);
    }

    // Clear refresh token cookie
    res.clearCookie('refresh_token', {
      path: '/',
    });

    return { message: 'Logout exitoso' };
  }
}
