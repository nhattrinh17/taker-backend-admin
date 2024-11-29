import { PaginationDto } from '@common/decorators';
import { IsOptional, IsString } from 'class-validator';

export class QueryBlogDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsString()
  blogCategoryId: string;
}
