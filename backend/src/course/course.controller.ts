import { Controller, Get, Param, Post, Query, Body, Delete } from '@nestjs/common';
import { CourseService } from './course.service';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) { }

  // NUS Mods API endpoints
  @Get('all-nus-courses')
  async getAllNUSCourses() {
    return this.courseService.getAllNUSCourses();
  }

  @Get('nus-course-data/:courseCode')
  async getNUSCourseData(@Param('courseCode') courseCode: string) {
    return this.courseService.getNUSCourseData(courseCode);
  }

  // Course table database endpoints
  @Get('all-courses')
  async getUserCourses(@Query('userId') userId: string) {
    return this.courseService.getAllCourses(userId);
  }

  @Get('all-courses-with-tasks')
  async getAllCoursesWithTasks(@Query('userId') userId: string) {
    return this.courseService.getAllCoursesWithTasks(userId);
  }

  @Get('course-info')
  async getUserCourse(@Query('courseCode') courseCode: string, @Query('userId') userId: string) {
    return this.courseService.getCourseInfo(userId, courseCode);
  }

  @Post('add-course')
  async addNUSCourse(@Body() body: any) {
    return this.courseService.addCourse(body.userId, body.courseCode, body.courseTitle, body.courseType);
  }


  @Delete('delete-course')
  async deleteCourse(@Body() body: any) {
    return this.courseService.deleteCourse(body.courseId);
  }

}
