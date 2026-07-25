import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { EmailModule } from './email/email.module';
import { CourseModule } from './course/course.module';
import { FolderModule } from './folder/folder.module';
import { LinkModule } from './link/link.module';
import { EventModule } from './event/event.module';
import { TaskModule } from './task/task.module';
import { PomodoroModule } from './pomodoro/pomodoro.module';
import { UserModule } from './user/user.module';
import { AgentModule } from './agent/agent.module';
import { ReminderModule } from './reminder/reminder.module';
import { createBullMqConfig } from './config/bullmq.config';
import { BullModule } from '@nestjs/bullmq/dist/bull.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    }),

    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: createBullMqConfig,
    }),

    AuthModule,
    PrismaModule,
    EmailModule,
    CourseModule,
    FolderModule,
    LinkModule,
    EventModule,
    TaskModule,
    PomodoroModule,
    UserModule,
    AgentModule,
    ReminderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
