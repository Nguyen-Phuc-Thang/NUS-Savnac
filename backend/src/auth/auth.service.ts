import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from "../prisma/prisma.service";
import { EmailService } from "../email/email.service";
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private emailService: EmailService) { }

  async register(email: string, password: string, name: string) {
    const existingUser = await this.prisma.client.user.findUnique({ where: { email } });

    if (existingUser) {
      throw new InternalServerErrorException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    await this.prisma.client.pendingUser.deleteMany({
      where: { email },
    });

    await this.prisma.client.pendingUser.create({
      data: {
        email,
        password: hashedPassword,
        name,

        otp,

        expiresAt: new Date(
          Date.now() + 10 * 60 * 1000,
        ),
      },
    });

    await this.emailService
      .sendVerificationCode(
        email,
        otp,
      );

    return { message: 'Verification code sent' };
  }

  async verify(email: string, code: string) {
    const pendingUser = await this.prisma.client.pendingUser.findUnique({ where: { email } });

    if (!pendingUser) {
      throw new InternalServerErrorException('Invalid verification code');
    }

    if (pendingUser.otp !== code) {
      throw new InternalServerErrorException('Invalid verification code');
    }

    if (pendingUser.expiresAt < new Date()) {
      throw new InternalServerErrorException('Verification code has expired');
    }

    const user = await this.prisma.client.user.create({
      data: {
        email: pendingUser.email,
        password: pendingUser.password,
        name: pendingUser.name,
      },
    });

    await this.prisma.client.pendingUser.delete({
      where: { email },
    });

    return { id: user.id, email: user.email, name: user.name };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.client.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return { id: user.id, email: user.email, name: user.name };
  }

}
