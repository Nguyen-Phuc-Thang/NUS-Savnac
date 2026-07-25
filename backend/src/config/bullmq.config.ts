import { ConfigService } from '@nestjs/config';
import { BullRootModuleOptions } from '@nestjs/bullmq';

export function createBullMqConfig(
  configService: ConfigService,
): BullRootModuleOptions {
  const redisUrl = configService.get<string>('REDIS_URL');

  if (!redisUrl) {
    throw new Error('REDIS_URL is not defined');
  }

  return {
    connection: {
      url: redisUrl,
    },
  };
}
