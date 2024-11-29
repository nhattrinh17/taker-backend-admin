import { IPeriod } from '@common/constants';
import { PaginationDto } from '@common/decorators';
import { ShoemakerStatusEnum } from '@common/enums/status.enum';
import { QuerySortDto } from '@common/filters';
import { Transform, Type } from 'class-transformer';
import { IsDate, IsEnum, IsIn, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class SearchShoemakerDto {
  @IsInt()
  @Transform(({ value }) => Number(value))
  take: number;

  @IsInt()
  @Type(() => Number)
  skip: number;

  @IsOptional()
  @IsEnum(ShoemakerStatusEnum)
  status: ShoemakerStatusEnum;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  start?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  end?: Date;

  @IsOptional()
  @IsString()
  keyword: string;
}

export class SearchShoemakerV2Dto extends PaginationDto {
  @IsOptional()
  @IsEnum(ShoemakerStatusEnum)
  status: ShoemakerStatusEnum;

  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  isVerified: number;

  @IsOptional()
  @IsString()
  referralCode: string;
}

export class CountShoemakerDto {
  @IsOptional()
  @IsString()
  keyword: string;

  @IsOptional()
  @IsEnum(ShoemakerStatusEnum)
  status: ShoemakerStatusEnum;
}

export class ShoemakerLongTimeActiveDto extends PaginationDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  days: number;
}

export class FilterTripAdminDto extends PaginationDto {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  isExport: number;

  @IsString()
  typeFilter: string;

  @IsOptional()
  @IsString()
  startDate: string;

  @IsOptional()
  @IsString()
  endDate: string;
}

export class QueyRankShoemakerDto {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  isExport: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  limit: number;

  @IsOptional()
  @IsIn(['week', 'month', 'today'])
  period: IPeriod;
}

export class QueyRankShoemakerActivityDto {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  isExport: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  limit: number;

  @IsOptional()
  @IsIn(['week', 'month', 'today'])
  period: IPeriod;
}

export class QueyRankShoemakerPerformanceDto {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  isExport: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  limit: number;

  @IsOptional()
  @IsIn(['week', 'month', 'today'])
  period: IPeriod;
}

export class QueryCustomerDownload {
  @IsOptional()
  @IsString()
  startDate: string;

  @IsOptional()
  @IsString()
  endDate: string;
}
