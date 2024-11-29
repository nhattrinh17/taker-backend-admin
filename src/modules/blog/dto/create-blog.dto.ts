import { StatusBlogEnum } from '@common/enums';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  name: string;

  @IsString()
  blogCategoryId: string;

  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  image: string;

  @IsString()
  typePress: string;

  @IsString()
  @IsOptional()
  screenCustomer: string;

  @IsString()
  @IsOptional()
  screenShoemaker: string;

  @IsString()
  @IsOptional()
  linkNavigate: string;

  @IsEnum(StatusBlogEnum)
  status: StatusBlogEnum;

  @IsBoolean()
  isPromotion: boolean;

  @IsString()
  @IsOptional()
  banner: string;

  @IsOptional()
  @IsBoolean()
  runBanner: boolean;
}
