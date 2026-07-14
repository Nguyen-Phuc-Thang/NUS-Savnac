import { Injectable } from '@nestjs/common';
import CreatePomodoroDto from './dto/create-pomodoro.dto';
import UpdatePomodoroDto from './dto/update-pomodoro.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PomodoroService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.client.pomodoro.findMany();
  }

  async findOne(id: string) {
    return this.prisma.client.pomodoro.findUnique({
      where: {
        pomodoroId: id,
      },
    });
  }

  async create(createPomodoroDto: CreatePomodoroDto) {
    return this.prisma.client.pomodoro.create({
      data: {
        name: createPomodoroDto.name,
        focusTime: createPomodoroDto.focusTime,
        breakTime: createPomodoroDto.breakTime,
      },
    });
  }

  async update(id: string, updatePomodoroDto: UpdatePomodoroDto) {
    return this.prisma.client.pomodoro.update({
      where: {
        pomodoroId: id,
      },
      data: updatePomodoroDto,
    });
  }

  async delete(id: string) {
    return this.prisma.client.pomodoro.delete({
      where: {
        pomodoroId: id,
      },
    });
  }
}
