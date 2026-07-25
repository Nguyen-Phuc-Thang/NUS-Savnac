import { IsDateString, IsUUID } from 'class-validator';

export default class CreateReminderDto {
  @IsUUID()
  eventId!: string;

  @IsDateString()
  remindAt!: string;
}
