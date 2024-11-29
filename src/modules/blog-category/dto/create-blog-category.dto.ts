import { StatusBlogEnum } from '@common/enums';
import { IsIn, IsString } from 'class-validator';

export class CreateBlogCategoryDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsIn([StatusBlogEnum.ACTIVE, StatusBlogEnum.INACTIVE])
  status: StatusBlogEnum;
}
