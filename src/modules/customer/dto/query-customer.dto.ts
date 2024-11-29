import { PaginationDto } from '@common/decorators';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class QueryCustomerFilter extends PaginationDto {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  isVerified: number;

  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  newUser: number;

  @IsOptional()
  @IsString()
  referralCode: string;
}

export class QueryCustomerLongTimeLogin extends PaginationDto {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  isExport: number;

  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  days: number;
}

export class QueryCustomerWithDataOder extends PaginationDto {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  isExport: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  minPrice: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  totalOrder: number;
}

export class QueryCustomerDownload {
  @IsOptional()
  @IsString()
  startDate: string;

  @IsOptional()
  @IsString()
  endDate: string;
}
