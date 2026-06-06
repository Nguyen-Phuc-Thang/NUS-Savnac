import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { EmailModule } from './email/email.module';
import { CourseModule } from './course/course.module';
import { FolderModule } from './folder/folder.module';
import { LinkModule } from './link/link.module';

@Module({
  imports: [AuthModule, PrismaModule, EmailModule, CourseModule, FolderModule, LinkModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
