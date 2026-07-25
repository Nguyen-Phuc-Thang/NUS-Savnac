import { Controller, Body, Post, Get } from '@nestjs/common';
import { ReminderService } from './reminder.service';
import CreateReminderDto from './dto/create-reminder.dto';

@Controller('reminder')
export class ReminderController {
  constructor(private readonly reminderService: ReminderService) {}

  @Post('create')
  async createReminder(@Body() dto: CreateReminderDto) {
    return await this.reminderService.createReminder(
      dto.eventId,
      new Date(dto.remindAt),
    );
  }

  @Get('get-reminder')
  async getReminderById(@Body() body: { reminderId: string }) {
    const { reminderId } = body;
    const reminder = await this.reminderService.getReminderById(reminderId);
    return reminder;
  }
}
