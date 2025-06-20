import { Controller, Post, Body } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('register')
  register(@Body('token') token: string) {
    console.log('✅ Token received from mobile app:', token);
    this.notificationsService.registerToken(token);
    return { success: true, message: 'Token registered' };
  }

  @Post('send')
  async send(@Body() body: { title: string; body: string }) {
    await this.notificationsService.sendPushNotification(body.title, body.body);
    return { success: true, message: 'Notification sent' };
  }
}
