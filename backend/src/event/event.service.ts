import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async getEventsByUserId(userId: string) {
    return this.prisma.client.event.findMany({
      where: {
        userId: userId,
      },
      include: {
        course: true,
      },
    });
  }

  async getEventsByCourseId(courseId: string) {
    return this.prisma.client.event.findMany({
      where: {
        courseId: courseId,
      },
    });
  }

  async addEvent(
    userId: string,
    eventType: 'CLASS' | 'DEADLINE' | 'EXAM' | 'OTHERS',
    eventTitle: string,
    eventWeek: string,
    eventDay: string,
    eventStartTime: string,
    eventEndTime: string,
    eventVenue?: string,
    courseId?: string,
  ) {
    try {
      return this.prisma.client.event.create({
        data: {
          userId: userId,
          eventType: eventType,
          courseId: courseId,
          title: eventTitle,
          week: eventWeek,
          day: eventDay,
          startTime: eventStartTime,
          endTime: eventEndTime,
          venue: eventVenue,
        },
      });
    } catch (error: any) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException(`${eventTitle} have already been added!`);
      }
      throw error;
    }
  }

  async updateEvent(
    eventId: string,
    eventType: 'CLASS' | 'DEADLINE' | 'EXAM' | 'OTHERS',
    eventTitle: string,
    eventWeek: string,
    eventDay: string,
    eventStartTime: string,
    eventEndTime: string,
    eventVenue?: string,
  ) {
    return this.prisma.client.event.update({
      where: {
        eventId: eventId,
      },
      data: {
        eventType: eventType,
        title: eventTitle,
        week: eventWeek,
        day: eventDay,
        startTime: eventStartTime,
        endTime: eventEndTime,
        venue: eventVenue,
      },
    });
  }

  async deleteEvent(eventId: string) {
    return this.prisma.client.event.delete({
      where: {
        eventId: eventId,
      },
    });
  }
}
