import { Module } from '@nestjs/common';
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

@Module({
  imports: [AuthModule, PrismaModule, EmailModule, CourseModule, FolderModule, LinkModule, EventModule, TaskModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
