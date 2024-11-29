import { Module } from '@nestjs/common';
import { BlogCategoryService } from './blog-category.service';
import { BlogCategoryController } from './blog-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogCategory } from '@entities/index';
import { BlogCategoryRepository } from 'src/database/repository/blogCategory.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BlogCategory])],
  controllers: [BlogCategoryController],
  providers: [
    BlogCategoryService,
    {
      provide: 'BlogCategoryRepositoryInterface',
      useClass: BlogCategoryRepository,
    },
  ],
  exports: [
    BlogCategoryService,
    {
      provide: 'BlogCategoryRepositoryInterface',
      useClass: BlogCategoryRepository,
    },
  ],
})
export class BlogCategoryModule {}
