import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { ResendProvider } from './providers/resend.provider';

@Injectable()
export class ContactService {
    constructor(private readonly resendProvider: ResendProvider) { }

    async create(createContactDto: CreateContactDto) {
        const { nombreCompleto, email, telefono, asunto, mensaje } = createContactDto;

        const subject = `[Contacto Web] ${asunto}`;

        const html = `
            <h2>Nuevo mensaje desde el sitio web</h2>
            <p><strong>Nombre:</strong> ${nombreCompleto}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Teléfono:</strong> ${telefono || 'No especificado'}</p>
            <hr />
            <p><strong>Mensaje:</strong></p>
            <p>${mensaje}</p>
        `;

        const recipient = process.env.CONTACT_EMAIL_RECIPIENT;
        if (!recipient) {
            throw new Error('CONTACT_EMAIL_RECIPIENT is not set');
        }

        return this.resendProvider.sendEmail(recipient, subject, html);
    }
}
