import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddEventDto {
    @IsNotEmpty()
    @IsString()
    userId!: string;

    @IsNotEmpty()
    @IsString()
    eventType!: string;

    @IsNotEmpty()
    @IsString()
    eventTitle!: string;

    @IsNotEmpty()
    @IsString()
    eventWeek!: string;

    @IsNotEmpty()
    @IsString()
    eventDay!: string;

    @IsNotEmpty()
    @IsString()
    eventStartTime!: string;

    @IsNotEmpty()
    @IsString()
    eventEndTime!: string;

    @IsOptional()
    @IsString()
    eventVenue?: string;

    @IsOptional()
    @IsString()
    courseId?: string;
}