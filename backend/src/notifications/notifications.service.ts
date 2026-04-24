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
                    tenant: { select: { id: true, email: true, name: true } },
                    landlord: { select: { id: true, email: true, name: true } },
                    property: { select: { title: true } },
                },
            });

            for (const contract of contracts) {
                const recipients = [
                    { id: contract.tenant.id, email: contract.tenant.email },
                    { id: contract.landlord.id, email: contract.landlord.email },
                ];
                const subject = `Contrato por vencer en ${days} días — ${contract.property.title}`;
                const html = buildExpirationHtml(contract, days);

                for (const recipient of recipients) {
                    try {
                        await this.resend.sendEmail(recipient.email, subject, html);
                        this.logger.log(`Expiration alert sent to ${recipient.email} for contract ${contract.id} (${days} days)`);
                        await this.prisma.notification.create({
                            data: {
                                type: 'contract_expiration',
                                channel: 'email',
                                status: 'sent',
                                scheduledAt: today,
                                sentAt: new Date(),
                                userId: recipient.id,
                                payload: {
                                    contractId: contract.id,
                                    propertyTitle: contract.property.title,
                                    daysLeft: days,
                                    endDate: contract.endDate,
                                    monthlyRent: contract.monthlyRent,
                                },
                            },
                        });
                    } catch (error) {
                        this.logger.error(`Failed to send expiration alert to ${recipient.email} for contract ${contract.id}`, error);
                        try {
                            await this.prisma.notification.create({
                                data: {
                                    type: 'contract_expiration',
                                    channel: 'email',
                                    status: 'failed',
                                    scheduledAt: today,
                                    sentAt: null,
                                    userId: recipient.id,
                                    payload: {
                                        contractId: contract.id,
                                        propertyTitle: contract.property.title,
                                        daysLeft: days,
                                        endDate: contract.endDate,
                                        errorMessage: error instanceof Error ? error.message : String(error),
                                    },
                                },
                            });
                        } catch (dbError) {
                            this.logger.error(`Failed to log notification failure for contract ${contract.id}`, dbError);
                        }
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
                tenant: { select: { id: true, email: true, name: true } },
                landlord: { select: { id: true, email: true, name: true } },
                property: { select: { title: true } },
            },
        });

        for (const contract of contracts) {
            const recipients = [
                { id: contract.tenant.id, email: contract.tenant.email },
                { id: contract.landlord.id, email: contract.landlord.email },
            ];
            const subject = `Ajuste de alquiler próximo — ${contract.property.title}`;
            const html = buildAdjustmentHtml(contract);

            for (const recipient of recipients) {
                try {
                    await this.resend.sendEmail(recipient.email, subject, html);
                    this.logger.log(`Adjustment alert sent to ${recipient.email} for contract ${contract.id}`);
                    await this.prisma.notification.create({
                        data: {
                            type: 'rent_adjustment',
                            channel: 'email',
                            status: 'sent',
                            scheduledAt: today,
                            sentAt: new Date(),
                            userId: recipient.id,
                            payload: {
                                contractId: contract.id,
                                propertyTitle: contract.property.title,
                                adjustmentDate: contract.nextAdjustmentDate,
                                monthlyRent: contract.monthlyRent,
                                adjustmentFrequency: contract.adjustmentFrequency,
                            },
                        },
                    });
                } catch (error) {
                    this.logger.error(`Failed to send adjustment alert to ${recipient.email} for contract ${contract.id}`, error);
                    try {
                        await this.prisma.notification.create({
                            data: {
                                type: 'rent_adjustment',
                                channel: 'email',
                                status: 'failed',
                                scheduledAt: today,
                                sentAt: null,
                                userId: recipient.id,
                                payload: {
                                    contractId: contract.id,
                                    propertyTitle: contract.property.title,
                                    adjustmentDate: contract.nextAdjustmentDate,
                                    errorMessage: error instanceof Error ? error.message : String(error),
                                },
                            },
                        });
                    } catch (dbError) {
                        this.logger.error(`Failed to log notification failure for contract ${contract.id}`, dbError);
                    }
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
