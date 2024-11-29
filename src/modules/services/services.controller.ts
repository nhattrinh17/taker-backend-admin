import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Version } from '@nestjs/common';
import { AdminsAuthGuard, Pagination, PaginationDto, ValidationPipe } from '@common/index';
import { ServicesService } from './services.service';
import { CreateServiceDto, QueryServiceDto } from './dto';

@UseGuards(AdminsAuthGuard)
@Controller('services')
export class ServicesController {
  constructor(private readonly service: ServicesService) {}

  @Get()
  @Version('1')
  findAll(@Pagination() pagination: PaginationDto, @Query(ValidationPipe) dto: QueryServiceDto) {
    return this.service.findAll(dto.search, pagination);
  }

  @Version('1')
  @Post('')
  create(@Body(new ValidationPipe()) dto: CreateServiceDto) {
    return this.service.create(dto);
  }

  @Version('1')
  @Patch(':id')
  update(@Param('id') id: string, @Body(new ValidationPipe()) dto: CreateServiceDto) {
    return this.service.update(id, dto);
  }

  @Version('1')
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
