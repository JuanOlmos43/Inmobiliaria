import { Controller, Get, Query, Patch, Param, Body, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService, UpdateUserDto } from './users.service';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('stats')
    @Roles(UserRole.Administrador)
    async getStats() {
        return this.usersService.getStatistics();
    }

    @Get()
    @Roles(UserRole.Administrador, UserRole.Agente)
    async findAll(@Query('role') role?: UserRole, @Query('email') email?: string) {
        return this.usersService.findAll(role, email);
    }

    @Patch(':id')
    @Roles(UserRole.Administrador)
    async update(@Param('id') id: string, @Body() updateData: UpdateUserDto) {
        return this.usersService.update(id, updateData);
    }

    @Delete(':id')
    @Roles(UserRole.Administrador)
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string) {
        return this.usersService.delete(id);
    }
}
