import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FolderModule } from 'src/folder/folder.module';

@Module({
  imports: [PrismaModule, FolderModule],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule { }
