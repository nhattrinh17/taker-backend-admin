import { PaginationDto } from '@common/decorators';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional } from 'class-validator';

enum TimeEnum {
  MONTH = 'MONTH',
}

export class SearchNotificationDto {
  @IsInt()
  @Transform(({ value }) => Number(value))
  take: number;

  @IsInt()
  @Type(() => Number)
  skip: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isSent: boolean;

  @IsOptional()
  @IsEnum(TimeEnum)
  time: TimeEnum;
}

export class SearchNotificationDtoV2 extends PaginationDto {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isSent: boolean;

  @IsOptional()
  @IsEnum(TimeEnum)
  time: string;
}

export class SearchCountDto {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isSent: boolean;

  @IsOptional()
  @IsEnum(TimeEnum)
  time: TimeEnum;
}
