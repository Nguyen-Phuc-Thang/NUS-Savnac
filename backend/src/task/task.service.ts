import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async getAllTasksByCourseId(courseId: string) {
    return this.prisma.client.task.findMany({
      where: {
        courseId: courseId,
      },
    });
  }

  async getAllTaskByUserId(userId: string) {
    return this.prisma.client.task.findMany({
      where: {
        userId: userId,
      },
      include: {
        course: true,
      },
    });
  }

  async getUncompletedTasksByUserId(userId: string) {
    return this.prisma.client.task.findMany({
      where: {
        userId,
        completed: false,
      },
      include: {
        course: true,
      },
    });
  }

  async createTask(
    userId: string,
    name: string,
    taskType: 'WEEKLY' | 'TODAY',
    courseId?: string,
  ) {
    return this.prisma.client.task.create({
      data: {
        userId: userId,
        name: name,
        taskType: taskType,
        courseId: courseId,
      },
    });
  }

  async markTaskAsCompleted(taskId: string) {
    return this.prisma.client.task.update({
      where: {
        taskId: taskId,
      },
      data: {
        completed: true,
      },
    });
  }

  async markTaskAsUncompleted(taskId: string) {
    return this.prisma.client.task.update({
      where: {
        taskId: taskId,
      },
      data: {
        completed: false,
      },
    });
  }

  async toggleTaskCompletion(taskId: string) {
    const task = await this.prisma.client.task.findUnique({
      where: {
        taskId: taskId,
      },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    return this.prisma.client.task.update({
      where: {
        taskId: taskId,
      },
      data: {
        completed: !task.completed,
      },
    });
  }

  async updateTaskName(taskId: string, name: string) {
    return this.prisma.client.task.update({
      where: {
        taskId: taskId,
      },
      data: {
        name: name,
      },
    });
  }

  async deleteTask(taskId: string) {
    return this.prisma.client.task.delete({
      where: {
        taskId: taskId,
      },
    });
  }
}
