import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ValidationPipe, UseGuards, Version, HttpException, HttpStatus } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { CreateVoucherDto, QueryVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { Pagination, PaginationDto } from '@common/decorators';
import { AdminsAuthGuard } from '@common/guards';

@UseGuards(AdminsAuthGuard)
@Controller('vouchers')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Post()
  @Version('1')
  async create(@Body() createVoucherDto: CreateVoucherDto) {
    try {
      return await this.voucherService.create(createVoucherDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  @Version('1')
  findAll(@Pagination() pagination: PaginationDto, @Query(ValidationPipe) dto: QueryVoucherDto) {
    return this.voucherService.findAll(dto.type, dto.search, dto.searchField, pagination, dto.sort, dto.typeSort);
  }

  @Get(':id/customer')
  @Version('1')
  async findOne(@Param('id') id: string, @Pagination() pagination: PaginationDto) {
    try {
      return await this.voucherService.findOneAndDataCustomer(id, pagination);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id')
  @Version('1')
  async update(@Param('id') id: string, @Body() updateVoucherDto: UpdateVoucherDto) {
    try {
      return await this.voucherService.update(id, updateVoucherDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  @Version('1')
  async remove(@Param('id') id: string) {
    try {
      return await this.voucherService.remove(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
