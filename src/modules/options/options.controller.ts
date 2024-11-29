import { AdminsAuthGuard, ValidationPipe } from '@common/index';
import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, UseGuards, Version } from '@nestjs/common';
import { CreateOptionCustomDto, CreateOptionDto } from './dto/create-option.dto';
import { OptionService } from './options.service';

@UseGuards(AdminsAuthGuard)
@Controller('options')
export class OptionController {
  constructor(private readonly service: OptionService) {}

  @Version('1')
  @Post('')
  create(@Body(new ValidationPipe()) dto: CreateOptionDto) {
    return this.service.create(dto);
  }

  @Version('1')
  @Get('')
  get() {
    return this.service.get();
  }

  @Version('1')
  @Post('custom')
  async createOption(@Body(new ValidationPipe()) dto: CreateOptionCustomDto) {
    try {
      return await this.service.createCustom(dto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Version('1')
  @Get(':key')
  getByKey(@Param(':key') key: string) {
    return this.service.getByKey(key);
  }
}
