
import { Module, Global } from '@nestjs/common';
import { StorageService } from './storage.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';


@Global()
@Module({
    imports: [ConfigModule, PrismaModule],
    providers: [StorageService],
    exports: [StorageService],
})
export class StorageModule { }
