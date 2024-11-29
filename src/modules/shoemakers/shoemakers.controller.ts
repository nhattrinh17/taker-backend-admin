import { AdminsAuthGuard } from '@common/guards/admins.guard';
import { ValidationPipe } from '@common/pipes/validation.pipe';
import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards, Version } from '@nestjs/common';
import { CountShoemakerDto, QueryCustomerDownload, SearchShoemakerDto, SearchShoemakerV2Dto, ShoemakerLongTimeActiveDto } from './dto/search-shoemakers.dto';
import { UpdateInformationDto } from './dto/update-shoemakers.dto';
import { ShoemakersService } from './shoemakers.service';
import { Pagination, PaginationDto } from '@common/decorators';

@UseGuards(AdminsAuthGuard)
@Controller('shoemakers')
export class ShoemakersController {
  constructor(private readonly service: ShoemakersService) {}

  @HttpCode(HttpStatus.OK)
  @Version('1')
  @Post('list')
  list(@Query(ValidationPipe) filter: SearchShoemakerDto) {
    return this.service.findList(filter);
  }

  @HttpCode(HttpStatus.OK)
  @Version('1')
  @Get('')
  listV2(@Pagination() pagination: PaginationDto, @Query(ValidationPipe) filter: SearchShoemakerV2Dto) {
    return this.service.findAllShoemaker(filter.search, filter.referralCode, filter.status, filter.isVerified, pagination, filter.sort, filter.typeSort);
  }

  @HttpCode(HttpStatus.OK)
  @Version('1')
  @Get('location')
  getAllLocation() {
    return this.service.getAllLocation();
  }

  @HttpCode(HttpStatus.OK)
  @Version('1')
  @Post('countRecords')
  countRecords(@Query(ValidationPipe) filter: CountShoemakerDto) {
    return this.service.countRecords(filter);
  }

  @Version('1')
  @Get('active')
  getShoemakerLongActive(@Pagination() pagination: PaginationDto, @Query(ValidationPipe) filter: ShoemakerLongTimeActiveDto) {
    return this.service.findShoemakerLongTimeNoActive(filter.days, pagination);
  }

  @HttpCode(HttpStatus.OK)
  @Version('1')
  @Get(':id')
  show(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.show(id);
  }

  @HttpCode(HttpStatus.OK)
  @Version('1')
  @Patch(':id')
  async update(@Param('id', new ParseUUIDPipe()) id: string, @Body(ValidationPipe) data: UpdateInformationDto) {
    try {
      return await this.service.update(id, data);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Version('1')
  @Patch(':id/reset-password')
  async updatePasswordCustomer(@Param('id') id: string) {
    try {
      return await this.service.resetPassword(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Version('1')
  @Get('statics/download')
  getDataDownload(@Query(ValidationPipe) dto: QueryCustomerDownload) {
    return this.service.getUserDownloadStatics(dto.startDate, dto.endDate);
  }
}
