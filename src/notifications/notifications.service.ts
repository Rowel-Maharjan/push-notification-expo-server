// src/notifications/notifications.service.ts
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly expoEndpoint = 'https://exp.host/--/api/v2/push/send';

  private pushTokens = new Set<string>();

  registerToken(token: string) {
    this.pushTokens.add(token);
    this.logger.log(`Token registered: ${token}`);
  }

  async sendPushNotification(title: string, body: string) {
    if (this.pushTokens.size === 0) {
      this.logger.warn('No tokens to send notifications to');
      return;
    }

    const messages = Array.from(this.pushTokens).map((token) => ({
      to: token,
      sound: 'default',
      title,
      body,
      data: { sentBy: 'NestJS backend' },
    }));

    try {
      const response = await axios.post(this.expoEndpoint, messages, {
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
      });
      this.logger.log('Expo response: ' + JSON.stringify(response.data));
    } catch (err: unknown) {
      const error = err as Error & { response?: { data?: any } };
      this.logger.error(
        'Error sending notification',
        error.response?.data || error.message,
      );
    }
  }
}
