import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Version, HttpException, HttpStatus, Query } from '@nestjs/common';
import { BonusPointsService } from './bonus_points.service';
import { CreateBonusPointDto } from './dto/create-bonus_point.dto';
import { UpdateBonusPointDto } from './dto/update-bonus_point.dto';
import { AdminsAuthGuard } from '@common/guards';
import { Pagination, PaginationDto } from '@common/decorators';
import { ValidationPipe } from '@common/pipes';
import { QueryBonusPointProduct } from './dto/query-bonus-point.dto';

@UseGuards(AdminsAuthGuard)
@Controller('bonus-point')
export class BonusPointsController {
  constructor(private readonly bonusPointsService: BonusPointsService) {}

  @Post()
  @Version('1')
  async create(@Body() createBonusPointDto: CreateBonusPointDto) {
    try {
      return await this.bonusPointsService.create(createBonusPointDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  @Version('1')
  async findAll(@Pagination() pagination: PaginationDto, @Query(ValidationPipe) query: QueryBonusPointProduct) {
    try {
      return this.bonusPointsService.findAll(query.search, query.type, pagination);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id/log')
  @Version('1')
  async getLogBonusPoint(@Param('id') id: string, @Pagination() pagination: PaginationDto) {
    try {
      return this.bonusPointsService.getBlogBonusPoint(id, pagination);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
