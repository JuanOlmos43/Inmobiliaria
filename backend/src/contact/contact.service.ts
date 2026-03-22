
import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { GmailProvider } from './providers/gmail.provider';

@Injectable()
export class ContactService {
    constructor(private readonly gmailProvider: GmailProvider) { }

    async create(createContactDto: CreateContactDto) {
        const { nombreCompleto, email, telefono, asunto, mensaje } = createContactDto;

        const emailSubject = `[Contacto Web] ${asunto}`;

        const emailBody = `Nuevo mensaje desde el sitio web

Nombre: ${nombreCompleto}
Email: ${email}
Teléfono: ${telefono || "No especificado"}

Mensaje:
${mensaje}`;

        // The user wants to "send mail from a technical account".
        // Usually, contact forms send an email TO the support address (the same technical account, or another one).
        // The prompt says: "Agregar como usuario de prueba el mismo correo Gmail que enviará los mails."
        // and "enviar correo usando gmail.users.messages.send".
        // It doesn't specify the recipient explicitly in the PROMPT section about "PROVIDER GMAIL".
        // But usually contact forms notify the admin.
        // Since we are authenticating as the technical account, `userId: 'me'` sends FROM that account.
        // If we want to prevent spamming random people, we usually send TO ourselves (the tech account) or a configured admin email.
        // The prompt says "replyTo = email del usuario".
        // I will assume the email is sent TO the technical account itself (self-notification) so the admins can see it.

        // The `GmailProvider.sendEmail` I wrote earlier didn't take a recipient, effectively sending to... wait.
        // My previous `GmailProvider` implementation constructs the raw message.
        // If I don't specify `To:` header, where does it go?
        // The Gmail API `users.messages.send` requires a valid RFC 822 message.
        // I should probably add a `To` header, or maybe the prompt implies we are sending a copy to the user?
        // "El sistema solo envía correos"
        // "Formato del correo ... Nuevo mensaje desde el sitio web ... Nombre ... Mensaje ..."
        // This sounds like a notification TO the company.

        // Detailed prompt:
        // "enviar correo usando gmail.users.messages.send"
        // "Formato del correo... Asunto... Cuerpo..."
        // "replyTo = email del usuario"

        // I need to update `GmailProvider` to include `To` header if I want it to be delivered somewhere specific.
        // If I omit `To`, it might not be delivered or might default to Bcc behavior?
        // Actually, I should probably send it to the authenticated user's email address (the technical account), 
        // effectively notifying the company.

        // I will modify `GmailProvider` to take a recipient, or hardcode it to 'me' implies checking profile?
        // Or just putting the tech email in the `To` header?
        // In OAuth, `me` is the user. I can just send to `me` (the authenticated user).
        // Or I can just omit `To` if I am just storing it? No, "El sistema envía correos".

        // Let's verify `GmailProvider` in previous step. 
        // I removed `to` argument in my `sendEmail` signature in the provider implementation.
        // I need to add `To` header in the message construction.
        // I will assume the recipient is the same account (the company). 
        // I will fetch the profile or just not specify `To`? No, that's bad practice.
        // I will hardcode `To` to the authenticated user if I can, or pass it.
        // Since I don't have the email address easily (unless I fetch profile), 
        // I can try to send with `To: <me>`? Gmail might replace it? No.

        // I will pass a recipient to `sendEmail`.
        // Who is the recipient? 
        // PROMPT: "Email soporte: correo del sistema"
        // PROMPT: "Agregar como usuario de prueba el mismo correo Gmail que enviará los mails."
        // It seems the system sends emails TO ITSELF (or the company) to notify of a contact.
        // I will add a method to get the profile email, OR just require a configured recipient via env var?
        // Or just use the token?

        // Getting user profile is easy with `gmail.users.getProfile`.
        // I'll update `GmailProvider` to fetch its own email on init, and use that as the recipient.

        return this.gmailProvider.sendEmail(
            emailSubject,
            emailBody,
            email // replyTo
        );
    }
}
