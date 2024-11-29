import { Controller, HttpCode, HttpStatus, Post, Version, Body, Get, UseGuards, Patch, HttpException } from '@nestjs/common';
import { AdminsAuthGuard, CurrentUser, ValidationPipe } from '@common/index';
import { AuthenticationService } from './authentication.service';

import { CreateAccountDto, LoginDto, updateInfoAdminDto } from './dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly service: AuthenticationService) {}

  @Version('1')
  @HttpCode(HttpStatus.OK)
  @Post('')
  async create(@Body(ValidationPipe) body: CreateAccountDto) {
    return this.service.create(body);
  }

  @Version('1')
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body(ValidationPipe) body: LoginDto) {
    return this.service.login(body);
  }

  @Version('1')
  @UseGuards(AdminsAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('userInfo')
  async userInfo(@CurrentUser() user) {
    return this.service.validateUser(user);
  }

  @Version('1')
  @UseGuards(AdminsAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Patch('')
  async updateInfo(@CurrentUser() user, @Body(ValidationPipe) dto: updateInfoAdminDto) {
    try {
      const id = user.sub;
      return await this.service.updateInfo(id, dto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
