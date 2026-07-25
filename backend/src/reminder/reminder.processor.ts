import { Logger } from '@nestjs/common';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { REMINDER_JOBS, REMINDER_QUEUE } from './reminder.constants';
import { SendReminderJobData } from './reminder.types';

import { ReminderService } from './reminder.service';
import { EmailService } from 'src/email/email.service';
import { UserService } from 'src/user/user.service';

@Processor(REMINDER_QUEUE)
export class ReminderProcessor extends WorkerHost {
  private readonly logger = new Logger(ReminderProcessor.name);

  constructor(
    private readonly reminderService: ReminderService,
    private readonly emailService: EmailService,
    private readonly userService: UserService,
  ) {
    super();
  }

  async process(job: Job<SendReminderJobData>): Promise<void> {
    switch (job.name) {
      case REMINDER_JOBS.SEND_REMINDER:
        await this.processReminder(job);
        return;

      default:
        throw new Error(`Unknown reminder job: ${job.name}`);
    }
  }

  private async processReminder(job: Job<SendReminderJobData>): Promise<void> {
    const { reminderId } = job.data;

    // Get event info from reminderId
    const reminder = await this.reminderService.getReminderById(reminderId);
    if (!reminder) {
      return;
    }

    const targetEvent = reminder.event;
    if (!targetEvent) {
      throw new Error(`Event not found for reminder: ${reminderId}`);
    }

    const user = await this.userService.getUserById(targetEvent.userId);
    if (!user) {
      throw new Error(`User not found for event: ${targetEvent.eventId}`);
    }

    // Send reminder via email
    await this.emailService.sendReminder(user.email, targetEvent);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<SendReminderJobData>): void {
    this.logger.log(`Reminder job ${job.id} completed`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<SendReminderJobData> | undefined, error: Error): void {
    this.logger.error(
      `Reminder job ${job?.id ?? 'unknown'} failed`,
      error.stack,
    );
  }
}
