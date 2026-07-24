import { Injectable } from '@nestjs/common';
import CreatePomodoroDto from './dto/create-pomodoro.dto';
import UpdatePomodoroDto from './dto/update-pomodoro.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PomodoroService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    let timers = await this.prisma.client.pomodoro.findMany({
      where: {
        userId,
      },
    });

    // This ensures that user always have at least one pomodoro
    if (timers.length === 0) {
      const defaultTimer = await this.prisma.client.pomodoro.create({
        data: {
          userId,
          name: 'Default',
          focusTime: 25 * 60,
          breakTime: 5 * 60,
        },
      });

      timers = [defaultTimer];
    }

    return timers;
  }
  async findOne(id: string, userId: string) {
    return this.prisma.client.pomodoro.findFirst({
      where: {
        pomodoroId: id,
        userId,
      },
    });
  }

  async create(userId: string, createPomodoroDto: CreatePomodoroDto) {
    return this.prisma.client.pomodoro.create({
      data: {
        userId,
        name: createPomodoroDto.name,
        focusTime: createPomodoroDto.focusTime,
        breakTime: createPomodoroDto.breakTime,
      },
    });
  }

  async update(
    id: string,
    userId: string,
    updatePomodoroDto: UpdatePomodoroDto,
  ) {
    return this.prisma.client.pomodoro.updateMany({
      where: {
        pomodoroId: id,
        userId,
      },
      data: updatePomodoroDto,
    });
  }

  async delete(id: string, userId: string) {
    return this.prisma.client.pomodoro.deleteMany({
      where: {
        pomodoroId: id,
        userId,
      },
    });
  }
}
