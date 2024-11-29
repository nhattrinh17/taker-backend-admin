import { PaginationDto } from '@common/decorators';
import { IsOptional, IsString } from 'class-validator';

export class QueryBonusPointProduct extends PaginationDto {
  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsString()
  type: string;
}
