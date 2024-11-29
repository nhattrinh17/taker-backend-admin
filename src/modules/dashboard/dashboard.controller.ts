import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Version } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { CreateDashboardDto, QueryDashboardShoe } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { ValidationPipe } from '@common/pipes';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('shoe')
  @Version('1')
  dashboard(@Query(ValidationPipe) dto: QueryDashboardShoe) {
    return this.dashboardService.findDashboardShoe(dto.startDate, dto.endDate);
  }
}
