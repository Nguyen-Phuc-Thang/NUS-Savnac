import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async register(@Body() body: any) {
    return this.authService.register(body.email, body.password, body.name);
  }

  @Post('verify')
  async verify(@Body() body: any) {
    return this.authService.verify(body.email, body.code);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: any) {
    return this.authService.login(body.email, body.password);

  }
}
