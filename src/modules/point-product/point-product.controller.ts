import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, HttpException, HttpStatus, Version } from '@nestjs/common';
import { PointProductService } from './point-product.service';
import { CreatePointProductDto } from './dto/create-point-product.dto';
import { UpdatePointProductDto } from './dto/update-point-product.dto';
import { AdminsAuthGuard } from '@common/guards';
import { Pagination, PaginationDto } from '@common/decorators';
import { QueryPointProduct } from './dto/query-point-product.dto';
import { ValidationPipe } from '@common/pipes';

@UseGuards(AdminsAuthGuard)
@Controller('point-product')
export class PointProductController {
  constructor(private readonly pointProductService: PointProductService) {}

  @Post()
  @Version('1')
  async create(@Body() createPointProductDto: CreatePointProductDto) {
    try {
      return await this.pointProductService.create(createPointProductDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  @Version('1')
  findAll(@Pagination() pagination: PaginationDto, @Query(ValidationPipe) query: QueryPointProduct) {
    return this.pointProductService.findAll(query.search, pagination);
  }

  @Get(':id')
  @Version('1')
  findOne(@Param('id') id: string) {
    return this.pointProductService.findOne(id);
  }

  @Patch(':id')
  @Version('1')
  async update(@Param('id') id: string, @Body() updatePointProductDto: UpdatePointProductDto) {
    try {
      return await this.pointProductService.update(id, updatePointProductDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  @Version('1')
  async remove(@Param('id') id: string) {
    try {
      return await this.pointProductService.remove(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
