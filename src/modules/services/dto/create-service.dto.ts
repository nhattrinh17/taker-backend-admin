import { PaginationDto } from '@common/decorators';
import { ShareType } from '@common/enums';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class QueryServiceDto extends PaginationDto {
  @IsString()
  @IsOptional()
  search: string;
}

export class CreateServiceDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsNumber()
  @IsOptional()
  discountPrice: number;

  @IsNumber()
  @IsOptional()
  discount: number;

  @IsString()
  @IsOptional()
  icon: string;

  @IsString()
  @IsOptional()
  shareType: ShareType;

  @IsNumber()
  @IsOptional()
  share: number;

  @IsBoolean()
  @IsOptional()
  experienceOnce: boolean;
}
