import { Controller, Get, Query, Version } from '@nestjs/common';
import { ExportService } from './export.service';
import { QueryExportCustomerToSheet, QueryExportShoemaker, QueryExportWithdraw } from './dto/create-export.dto';

import { Pagination, PaginationDto } from '@common/decorators';
import { ValidationPipe } from '@common/pipes';

@Controller('export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get('shoemaker')
  @Version('1')
  findAllShoemaker(@Pagination() pagination: PaginationDto, @Query(ValidationPipe) dto: QueryExportShoemaker) {
    return this.exportService.findShoemaker(dto.search, dto.startDate, dto.endDate, pagination, dto.sort, dto.typeSort);
  }

  @Get('shoemaker/sheet')
  @Version('1')
  exportShoemakerSheet(@Query(ValidationPipe) dto: QueryExportShoemaker) {
    return this.exportService.exportShoemakerToSheet(dto.startDate, dto.endDate);
  }

  @Get('customer')
  @Version('1')
  findAllCustomer(@Pagination() pagination: PaginationDto, @Query(ValidationPipe) dto: QueryExportShoemaker) {
    return this.exportService.findCustomer(dto.search, dto.startDate, dto.endDate, pagination, dto.sort, dto.typeSort);
  }

  @Get('customer/sheet')
  @Version('1')
  exportCustomerSheet(@Query(ValidationPipe) dto: QueryExportCustomerToSheet) {
    return this.exportService.exportCustomerToSheet(dto.isVerified, dto.startDate, dto.endDate);
  }

  @Get('withdraw')
  @Version('1')
  findAllWidthDraw(@Pagination() pagination: PaginationDto, @Query(ValidationPipe) dto: QueryExportWithdraw) {
    return this.exportService.findWithdraw(dto.startDate, dto.endDate, pagination, dto.sort, dto.typeSort);
  }

  @Get('withdraw/sheet')
  @Version('1')
  exportWithdrawSheet(@Query(ValidationPipe) dto: QueryExportWithdraw) {
    return this.exportService.exportWithdrawToSheet(dto.startDate, dto.endDate);
  }
}
