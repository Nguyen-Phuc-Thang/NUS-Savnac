import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
