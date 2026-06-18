import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class EventService {
    constructor(private prisma: PrismaService) { }

    async getEventsByUserId(userId: string) {
        return this.prisma.client.event.findMany({
            where: {
                userId: userId,
            },
            include: {
                course: true,
            }
        });
    }

    async getEventsByCourseId(courseId: string) {
        return this.prisma.client.event.findMany({
            where: {
                courseId: courseId,
            },
        });
    }

    async addEvent(userId: string, eventType: "CLASS" | "DEADLINE" | "EXAM" | "OTHERS", eventTitle: string, eventWeek: string, eventDay: string, eventStartTime: string, eventEndTime: string, eventVenue?: string, courseId?: string) {
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
            }
        });
    }

    async deleteEvent(eventId: string) {
        return this.prisma.client.event.delete({
            where: {
                eventId: eventId,
            }
        });
    }
}
