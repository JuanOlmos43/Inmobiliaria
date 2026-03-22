
import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { GmailProvider } from './providers/gmail.provider';

@Module({
    controllers: [ContactController],
    providers: [ContactService, GmailProvider],
})
export class ContactModule { }
