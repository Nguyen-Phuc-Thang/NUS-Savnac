import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

import { REMINDER_JOBS, REMINDER_QUEUE } from './reminder.constants';
import { SendReminderJobData } from './reminder.types';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReminderService {
  constructor(
    @InjectQueue(REMINDER_QUEUE)
    private readonly reminderQueue: Queue<SendReminderJobData>,
    private readonly prismaService: PrismaService,
  ) {}

  async createReminder(eventId: string, remindAt: Date) {
    const reminder = await this.prismaService.client.reminder.create({
      data: {
        eventId,
        remindAt,
      },
    });

    await this.scheduleReminder(reminder.reminderId, remindAt);
    return reminder;
  }

  async getReminderById(reminderId: string) {
    return await this.prismaService.client.reminder.findUnique({
      where: {
        reminderId: reminderId,
      },
      include: {
        event: true,
      },
    });
  }

  async scheduleReminder(reminderId: string, remindAt: Date): Promise<void> {
    const delay = remindAt.getTime() - Date.now();

    if (delay <= 0) {
      throw new BadRequestException('Reminder time must be in the future');
    }

    await this.reminderQueue.add(
      REMINDER_JOBS.SEND_REMINDER,
      {
        reminderId,
      },
      {
        jobId: reminderId,
        delay,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    );
  }

  async cancelReminder(reminderId: string): Promise<void> {
    const job = await this.reminderQueue.getJob(reminderId);

    if (job) {
      await job.remove();
    }
  }
}
