import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Version, Query } from '@nestjs/common';
import { TripService } from './trip.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { AdminsAuthGuard } from '@common/guards';
import { Pagination, PaginationDto } from '@common/decorators';
import { FilterTripAdminDto, QueyRankShoemakerActivityDto, QueyRankShoemakerDto, QueyRankShoemakerPerformanceDto } from '../shoemakers/dto/search-shoemakers.dto';
import { ValidationPipe } from '@common/pipes';

@UseGuards(AdminsAuthGuard)
@Controller('trips')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Get('')
  @Version('1')
  findAll(@Pagination() pagination: PaginationDto, @Query(ValidationPipe) filter: FilterTripAdminDto) {
    return this.tripService.findAll(filter.typeFilter, pagination, filter.startDate, filter.endDate, filter.sort, filter.typeSort, filter.isExport);
  }

  @Get('/real-time')
  @Version('1')
  findAllPending(@Pagination() pagination: PaginationDto) {
    return this.tripService.findTripPending(pagination);
  }

  @Get('/:id')
  @Version('1')
  getTripById(@Param('id') id: string) {
    return this.tripService.getTripById(id);
  }

  @Get('ranking/income')
  @Version('1')
  getRanking(@Query(ValidationPipe) { period, limit, isExport }: QueyRankShoemakerDto) {
    return this.tripService.getRankingShoemaker(limit, period, isExport);
  }

  @Get('ranking/activity-rate')
  @Version('1')
  getRankingActivity(@Query(ValidationPipe) { period, limit, isExport }: QueyRankShoemakerActivityDto) {
    return this.tripService.getRankingActivityShoemaker(limit, period, isExport);
  }

  @Get('ranking/performance')
  @Version('1')
  getRankingPerformance(@Query(ValidationPipe) { period, limit, isExport }: QueyRankShoemakerPerformanceDto) {
    return this.tripService.getRankingPerformanceShoemaker(limit, period, isExport);
  }
}
