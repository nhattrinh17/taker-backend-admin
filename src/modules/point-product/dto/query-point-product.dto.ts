import { PaginationDto } from '@common/decorators';
import { IsOptional, IsString } from 'class-validator';

export class QueryPointProduct extends PaginationDto {
  @IsOptional()
  @IsString()
  search: string;
}
