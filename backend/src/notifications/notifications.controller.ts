import { Controller, Post, HttpCode } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notifications: NotificationsService) { }

    // TODO: remove this endpoint after testing
    @Post('test')
    @HttpCode(200)
    async testAlerts() {
        await this.notifications.checkContractAlerts();
        return { message: 'Contract alerts check executed. See server logs for details.' };
    }
}
