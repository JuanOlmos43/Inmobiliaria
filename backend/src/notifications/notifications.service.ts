import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { ResendProvider } from '../contact/providers/resend.provider';

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly resend: ResendProvider,
    ) { }

    @Cron('0 7 * * *', { name: 'contract-alerts' })
    async checkContractAlerts() {
        this.logger.log('Running daily contract alerts check...');
        await Promise.all([
            this.sendExpirationAlerts(),
            this.sendAdjustmentAlerts(),
        ]);
    }

    private async sendExpirationAlerts() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const alertDays = [30, 7];

        for (const days of alertDays) {
            const targetDate = new Date(today);
            targetDate.setDate(targetDate.getDate() + days);
            const nextDate = new Date(targetDate);
            nextDate.setDate(nextDate.getDate() + 1);

            const contracts = await this.prisma.rentalContract.findMany({
                where: {
                    status: 'active',
                    endDate: { gte: targetDate, lt: nextDate },
                },
                include: {
                    tenant: { select: { email: true, name: true } },
                    landlord: { select: { email: true, name: true } },
                    property: { select: { title: true } },
                },
            });

            for (const contract of contracts) {
                const recipients = [contract.tenant.email, contract.landlord.email];
                const subject = `Contrato por vencer en ${days} días — ${contract.property.title}`;
                const html = buildExpirationHtml(contract, days);

                for (const recipient of recipients) {
                    try {
                        await this.resend.sendEmail(recipient, subject, html);
                        this.logger.log(`Expiration alert sent to ${recipient} for contract ${contract.id} (${days} days)`);
                    } catch (error) {
                        this.logger.error(`Failed to send expiration alert to ${recipient} for contract ${contract.id}`, error);
                    }
                }
            }
        }
    }

    private async sendAdjustmentAlerts() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const in7Days = new Date(today);
        in7Days.setDate(in7Days.getDate() + 7);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Contratos con ajuste entre mañana y en 7 días
        const contracts = await this.prisma.rentalContract.findMany({
            where: {
                status: 'active',
                nextAdjustmentDate: { gte: tomorrow, lte: in7Days },
            },
            include: {
                tenant: { select: { email: true, name: true } },
                landlord: { select: { email: true, name: true } },
                property: { select: { title: true } },
            },
        });

        for (const contract of contracts) {
            const recipients = [contract.tenant.email, contract.landlord.email];
            const subject = `Ajuste de alquiler próximo — ${contract.property.title}`;
            const html = buildAdjustmentHtml(contract);

            for (const recipient of recipients) {
                try {
                    await this.resend.sendEmail(recipient, subject, html);
                    this.logger.log(`Adjustment alert sent to ${recipient} for contract ${contract.id}`);
                } catch (error) {
                    this.logger.error(`Failed to send adjustment alert to ${recipient} for contract ${contract.id}`, error);
                }
            }
        }
    }
}

function buildExpirationHtml(contract: any, daysLeft: number): string {
    const endDate = new Date(contract.endDate).toLocaleDateString('es-AR');
    return `
        <h2>Aviso de vencimiento de contrato</h2>
        <p>El contrato de alquiler de la propiedad <strong>${contract.property.title}</strong> vence en <strong>${daysLeft} días</strong> (${endDate}).</p>
        <h3>Detalles del contrato</h3>
        <ul>
            <li><strong>Inquilino:</strong> ${contract.tenant.name || contract.tenant.email}</li>
            <li><strong>Propietario:</strong> ${contract.landlord.name || contract.landlord.email}</li>
            <li><strong>Fecha de vencimiento:</strong> ${endDate}</li>
            <li><strong>Alquiler mensual:</strong> $${contract.monthlyRent.toLocaleString('es-AR')}</li>
        </ul>
        <p>Por favor, coordinen la renovación o finalización del contrato con la inmobiliaria.</p>
    `;
}

function buildAdjustmentHtml(contract: any): string {
    const adjustmentDate = new Date(contract.nextAdjustmentDate).toLocaleDateString('es-AR');
    return `
        <h2>Aviso de ajuste de alquiler</h2>
        <p>El contrato de alquiler de la propiedad <strong>${contract.property.title}</strong> tiene un ajuste programado para el <strong>${adjustmentDate}</strong>.</p>
        <h3>Detalles del contrato</h3>
        <ul>
            <li><strong>Inquilino:</strong> ${contract.tenant.name || contract.tenant.email}</li>
            <li><strong>Propietario:</strong> ${contract.landlord.name || contract.landlord.email}</li>
            <li><strong>Alquiler actual:</strong> $${contract.monthlyRent.toLocaleString('es-AR')}</li>
            <li><strong>Frecuencia de ajuste:</strong> cada ${contract.adjustmentFrequency} mes/es</li>
        </ul>
        <p>Comuníquense con la inmobiliaria para coordinar el nuevo valor del alquiler.</p>
    `;
}
