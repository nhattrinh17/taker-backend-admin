import { Controller, Get, Post, Body, Patch, Param, Delete, Version, Query, UseGuards } from '@nestjs/common';

import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerAdminService } from './customer.service';
import { Pagination, PaginationDto } from '@common/decorators';
import { ValidationPipe } from '@common/pipes';
import { QueryCustomerDownload, QueryCustomerFilter, QueryCustomerLongTimeLogin, QueryCustomerWithDataOder } from './dto/query-customer.dto';
import { AdminsAuthGuard } from '@common/guards';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@UseGuards(AdminsAuthGuard)
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerAdminService) {}

  @Version('1')
  @Get('login')
  getAllCustomer(@Pagination() pagination: PaginationDto, @Query(ValidationPipe) dto: QueryCustomerLongTimeLogin) {
    return this.customerService.getCustomerLongTimeLogin(dto.days, pagination, dto.isExport);
  }

  @Version('1')
  @Get('no-order')
  getAllNoOrder(@Pagination() pagination: PaginationDto, @Query(ValidationPipe) dto: QueryCustomerLongTimeLogin) {
    return this.customerService.findCustomersLongTimeNoOrder(dto.days, pagination, dto.isExport);
  }

  @Version('1')
  @Get('data-order')
  getAllWithDataOrder(@Pagination() pagination: PaginationDto, @Query(ValidationPipe) dto: QueryCustomerWithDataOder) {
    return this.customerService.findAllWithDataOrder(dto.totalOrder, dto.minPrice, pagination, dto.sort, dto.typeSort, dto.isExport);
  }

  @Version('1')
  @Get('statics/download')
  getDataDownload(@Query(ValidationPipe) dto: QueryCustomerDownload) {
    return this.customerService.getUserDownloadStatics(dto.startDate, dto.endDate);
  }

  @Version('1')
  @Get('')
  getAll(@Pagination() pagination: PaginationDto, @Query(ValidationPipe) dto: QueryCustomerFilter) {
    return this.customerService.getAll(dto.search, dto.referralCode, dto.isVerified, dto.newUser, pagination, dto.sort, dto.typeSort);
  }

  @Version('1')
  @Patch(':id')
  updateCustomer(@Param('id') id: string, @Body(ValidationPipe) dto: UpdateCustomerDto) {
    console.log('🚀 ~ CustomerController ~ updateCustomer ~ id:', id);
    return this.customerService.updateInfoCustomer(id, dto);
  }

  @Version('1')
  @Patch(':id/reset-password')
  updatePasswordCustomer(@Param('id') id: string) {
    return this.customerService.resetPassword(id);
  }
}
