import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserById(userId: string) {
    return this.prisma.client.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  async updateName(userId: string, updateUserDto: UpdateUserDto) {
    return this.prisma.client.user.update({
      where: {
        id: userId,
      },
      data: {
        name: updateUserDto.name,
      },
    });
  }
}
