import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from '@entities/index';
import { BlogRepository } from 'src/database/repository/blog.repository';
import { BlogCategoryModule } from '@modules/blog-category/blog-category.module';
import { BlogCategoryService } from '@modules/blog-category/blog-category.service';

@Module({
  imports: [TypeOrmModule.forFeature([Blog]), BlogCategoryModule],
  controllers: [BlogController],
  providers: [
    BlogCategoryService,
    BlogService,
    {
      provide: 'BlogRepositoryInterface',
      useClass: BlogRepository,
    },
  ],
})
export class BlogModule {}
