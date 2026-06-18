import { Controller, Get, Param, Post, Query, Body } from '@nestjs/common';
import { CourseService } from './course.service';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) { }

  // NUS Mods API endpoints
  @Get('all-nus-courses')
  async getAllNUSCourses() {
    return this.courseService.getAllNUSCourses();
  }

  @Get('course-data/:courseCode')
  async getCourseData(@Param('courseCode') courseCode: string) {
    return this.courseService.getCourseData(courseCode);
  }

  // Course table database endpoints
  @Get('user-courses')
  async getUserCourses(@Query('userId') userId: string) {
    return this.courseService.getUserCourses(userId);
  }

  @Get('all-courses-with-tasks')
  async getAllCoursesWithTasksByUserId(@Query('userId') userId: string) {
    return this.courseService.getAllCoursesWithTasksByUserId(userId);
  }

  @Get('user-course')
  async getUserCourse(@Query('courseCode') courseCode: string, @Query('userId') userId: string) {
    return this.courseService.getUserCourse(courseCode, userId);
  }

  @Post('add-nus-course')
  async addNUSCourse(@Body() body: any) {
    return this.courseService.addNUSCourseToUser(body.userId, body.courseCode);
  }

}
