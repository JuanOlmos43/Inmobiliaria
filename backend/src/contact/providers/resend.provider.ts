import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class ResendProvider {
  private readonly resend: Resend;
  private readonly logger = new Logger(ResendProvider.name);

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      this.logger.error('RESEND_API_KEY is not set');
    }
    this.resend = new Resend(apiKey);
  }

  async sendEmail(to: string | string[], subject: string, html: string) {
    try {
      const { error } = await this.resend.emails.send({
        from:
          process.env.RESEND_FROM_EMAIL ||
          'Inmobiliaria <onboarding@resend.dev>',
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
      });

      if (error) {
        this.logger.error('Resend API error', error);
        throw new InternalServerErrorException('Failed to send email');
      }

      this.logger.log(
        `Email sent to: ${Array.isArray(to) ? to.join(', ') : to}`,
      );
      return { success: true };
    } catch (error) {
      this.logger.error('Error sending email', error);
      throw new InternalServerErrorException('Failed to send email');
    }
  }
}
