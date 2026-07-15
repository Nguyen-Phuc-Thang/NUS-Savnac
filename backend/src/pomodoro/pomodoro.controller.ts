import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { PomodoroService } from './pomodoro.service';
import CreatePomodoroDto from './dto/create-pomodoro.dto';
import UpdatePomodoroDto from './dto/update-pomodoro.dto';

@Controller('pomodoro')
export class PomodoroController {
  constructor(private readonly pomodoroService: PomodoroService) {}

  @Get()
  findAll(@Query('userId') userId: string) {
    return this.pomodoroService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('userId') userId: string) {
    return this.pomodoroService.findOne(id, userId);
  }

  @Post()
  create(
    @Query('userId') userId: string,
    @Body(ValidationPipe) createPomodoroDto: CreatePomodoroDto,
  ) {
    return this.pomodoroService.create(userId, createPomodoroDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Query('userId') userId: string,
    @Body() updatePomodoroDto: UpdatePomodoroDto,
  ) {
    return this.pomodoroService.update(id, userId, updatePomodoroDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Query('userId') userId: string) {
    return this.pomodoroService.delete(id, userId);
  }
}
