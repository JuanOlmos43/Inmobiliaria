import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { ResendProvider } from './providers/resend.provider';

@Module({
    controllers: [ContactController],
    providers: [ContactService, ResendProvider],
    exports: [ResendProvider],
})
export class ContactModule { }
