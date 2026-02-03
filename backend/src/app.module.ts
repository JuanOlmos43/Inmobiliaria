import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PropiedadesModule } from './propiedades/propiedades.module';
import { UbicacionesModule } from './ubicaciones/ubicaciones.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { StorageModule } from './storage/storage.module';

import { ConfigModule } from '@nestjs/config';
import { ContratosModule } from './contratos/contratos.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    PropiedadesModule,
    UbicacionesModule,
    UsersModule,
    AuthModule,
    StorageModule,
    ContratosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
