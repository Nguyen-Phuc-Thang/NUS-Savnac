import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { PomodoroService } from './pomodoro.service';
import CreatePomodoroDto from './dto/create-pomodoro.dto';
import UpdatePomodoroDto from './dto/update-pomodoro.dto';

@Controller('pomodoro')
export class PomodoroController {
  constructor(private readonly pomodoroService: PomodoroService) {}

  @Get()
  findAll() {
    return this.pomodoroService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pomodoroService.findOne(id);
  }

  @Post()
  create(@Body(ValidationPipe) createPomodoroDto: CreatePomodoroDto) {
    return this.pomodoroService.create(createPomodoroDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePomodoroDto: UpdatePomodoroDto,
  ) {
    return this.pomodoroService.update(id, updatePomodoroDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.pomodoroService.delete(id);
  }
}
