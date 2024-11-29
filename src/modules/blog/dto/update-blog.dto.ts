import { PartialType } from '@nestjs/mapped-types';
import { CreateBlogDto } from './create-blog.dto';
import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateBlogDto extends PartialType(CreateBlogDto) {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  order: number;
}
