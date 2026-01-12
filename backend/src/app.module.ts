import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PropiedadesModule } from './propiedades/propiedades.module';
import { UbicacionesModule } from './ubicaciones/ubicaciones.module';

@Module({
  imports: [PrismaModule, PropiedadesModule, UbicacionesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
