import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { REMINDER_QUEUE } from './reminder.constants';
import { ReminderService } from './reminder.service';
import { ReminderProcessor } from './reminder.processor';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EmailModule } from 'src/email/email.module';
import { UserModule } from 'src/user/user.module';
import { ReminderController } from './reminder.controller';

@Module({
  imports: [
    BullModule.registerQueue({
      name: REMINDER_QUEUE,
    }),
    PrismaModule,
    EmailModule,
    UserModule,
  ],
  controllers: [ReminderController],
  providers: [ReminderService, ReminderProcessor],
  exports: [ReminderService],
})
export class ReminderModule {}
