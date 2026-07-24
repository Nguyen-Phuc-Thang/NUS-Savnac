import { PartialType } from '@nestjs/mapped-types';
import CreatePomodoroDto from './create-pomodoro.dto';

export default class UpdatePomodoroDto extends PartialType(CreatePomodoroDto) {}
