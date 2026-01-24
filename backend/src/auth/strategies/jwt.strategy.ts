import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import type { Request } from 'express';

// Tipo para el payload del JWT
interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: (req: Request) => {
        if (req && req.cookies) {
          return req.cookies['access_token'];
        }
        return null;
      },
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET || 'fallback-secret-key',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    return user; // This will be attached to request.user
  }
}
