import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Version, HttpException, HttpStatus } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { Pagination, PaginationDto } from '@common/decorators';
import { ValidationPipe } from '@common/pipes';
import { QueryFindWallet, QueryFindWalletLogs } from './dto/query-wallet.dto';
import { UpdateWalletShoemakerDto } from './dto/create-wallet.dto';
import { AdminsAuthGuard } from '@common/guards';

@UseGuards(AdminsAuthGuard)
@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Post()
  @Version('1')
  async updateWallet(@Body() dto: UpdateWalletShoemakerDto) {
    try {
      return await this.walletsService.updateWallet(dto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  @Version('1')
  findAll(@Pagination() pagination: PaginationDto, @Query(ValidationPipe) dto: QueryFindWallet) {
    return this.walletsService.findAll(dto?.type, dto?.search, pagination);
  }

  @Get('logs')
  @Version('1')
  findAllLog(@Pagination() pagination: PaginationDto, @Query(ValidationPipe) dto: QueryFindWalletLogs) {
    return this.walletsService.findAllWalletLog(dto?.walletId, pagination);
  }
}
