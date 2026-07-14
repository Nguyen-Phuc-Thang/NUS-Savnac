import { OmitType, PartialType } from '@nestjs/mapped-types';
import CreatePomodoroDto from './create-pomodoro.dto';

export default class UpdatePomodoroDto extends PartialType(
  OmitType(CreatePomodoroDto, ['userId'] as const),
) {}
