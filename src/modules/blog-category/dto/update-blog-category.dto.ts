import { PartialType } from '@nestjs/mapped-types';
import { CreateBlogCategoryDto } from './create-blog-category.dto';
import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateBlogCategoryDto extends PartialType(CreateBlogCategoryDto) {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  order: number;
}
