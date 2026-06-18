import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) { }


  @Get('get-all-tasks-by-course')
  async getAllTasksByCourseId(@Query('courseId') courseId: string) {
    return this.taskService.getAllTasksByCourseId(courseId);
  }

  @Get('get-all-tasks-by-user')
  async getAllTaskByUserId(@Query('userId') userId: string) {
    return this.taskService.getAllTaskByUserId(userId);
  }

  @Post('create-task')
  async createTask(@Body() body: any) {
    return this.taskService.createTask(body.userId, body.name, body.taskType, body.courseId);
  }

  @Post('complete-task')
  async completeTask(@Query('taskId') taskId: string) {
    return this.taskService.markTaskAsCompleted(taskId);
  }

  @Post('uncomplete-task')
  async uncompleteTask(@Query('taskId') taskId: string) {
    return this.taskService.markTaskAsUncompleted(taskId);
  }

  @Post('toggle-task')
  async toggleTask(@Query('taskId') taskId: string) {
    return this.taskService.toggleTaskCompletion(taskId);
  }
}
