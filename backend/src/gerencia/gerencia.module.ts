import { Module } from '@nestjs/common';
import { GerenciaService } from './gerencia.service';
import { GerenciaController } from './gerencia.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [GerenciaService],
  controllers: [GerenciaController],
})
export class GerenciaModule {}
