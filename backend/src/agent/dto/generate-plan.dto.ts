import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

enum EventType {
  EXAM = 'EXAM',
  DEADLINE = 'DEADLINE',
  CLASS = 'CLASS',
  OTHER = 'OTHER',
}

enum Intensity {
  LIGHT = 'LIGHT',
  MODERATE = 'MODERATE',
  INTENSIVE = 'INTENSIVE',
}

class EventDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  event_id!: string;

  @IsEnum(EventType)
  event_type!: EventType;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  week!: string;

  @IsString()
  day!: string;

  @IsString()
  start_time!: string;

  @IsOptional()
  @IsString()
  end_time?: string;

  @IsOptional()
  @IsString()
  venue?: string;

  @IsOptional()
  @IsString()
  course_id?: string;
}

class PlanningPreferencesDto {
  @IsString()
  @IsNotEmpty()
  preparation_time!: string;

  @IsEnum(Intensity)
  intensity!: Intensity;

  @IsOptional()
  @IsString()
  notes?: string;
}

export default class GeneratePlanDto {
  @ValidateNested()
  @Type(() => EventDto)
  target_event!: EventDto;

  @ValidateNested()
  @Type(() => PlanningPreferencesDto)
  preferences!: PlanningPreferencesDto;

  @ValidateNested({ each: true })
  @Type(() => EventDto)
  existing_events!: EventDto[];

  @IsString()
  @IsNotEmpty()
  planning_session_id!: string;
}
