import { PaginationDto } from '@common/decorators';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class QueryExportShoemaker extends PaginationDto {
  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsString()
  startDate: string;

  @IsOptional()
  @IsString()
  endDate: string;
}

export class QueryExportCustomerToSheet {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  isVerified: number;

  @IsOptional()
  @IsString()
  startDate: string;

  @IsOptional()
  @IsString()
  endDate: string;
}

export class QueryExportWithdraw extends PaginationDto {
  @IsOptional()
  @IsString()
  startDate: string;

  @IsOptional()
  @IsString()
  endDate: string;
}

export class CreateExportDto {}
