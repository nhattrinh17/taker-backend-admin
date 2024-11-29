import { PaginationDto } from '@common/decorators';
import { IsOptional, IsString } from 'class-validator';

export class QueryBlogCategoryDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search: string;
}
