import { Controller, Get, Post, Body, Param, Query, Delete } from '@nestjs/common';
import { EventService } from './event.service';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) { }

  @Get('get-events-by-user-id')
  async getEventsByUserId(@Query('userId') userId: string) {
    return this.eventService.getEventsByUserId(userId);
  }

  @Get('get-events-by-course-id')
  async getEventsByCourseId(@Query('courseId') courseId: string) {
    return this.eventService.getEventsByCourseId(courseId);
  }

  @Post('add-event')
  async addEvent(@Body() body: any) {
    return this.eventService.addEvent(
      body.userId,
      body.eventType,
      body.eventTitle,
      body.eventWeek,
      body.eventDay,
      body.eventStartTime,
      body.eventEndTime,
      body.eventVenue,
      body.courseId
    );
  }

  @Post('update-event')
  async updateEvent(@Body() body: any) {
    return this.eventService.updateEvent(
      body.eventId,
      body.eventType,
      body.eventTitle,
      body.eventWeek,
      body.eventDay,
      body.eventStartTime,
      body.eventEndTime,
      body.eventVenue
    );
  }

  @Delete('delete-event')
  async deleteEvent(@Body() body: any) {
    return this.eventService.deleteEvent(body.eventId);
  }
}
