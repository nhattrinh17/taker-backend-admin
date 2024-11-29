import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Version, HttpException, HttpStatus } from '@nestjs/common';
import { BlogCategoryService } from './blog-category.service';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
import { UpdateBlogCategoryDto } from './dto/update-blog-category.dto';
import { Pagination, PaginationDto } from '@common/decorators';
import { ValidationPipe } from '@common/pipes';
import { QueryBlogCategoryDto } from './dto/query-blog-category.dto';
import { AdminsAuthGuard } from '@common/guards';

@UseGuards(AdminsAuthGuard)
@Controller('blog-category')
export class BlogCategoryController {
  constructor(private readonly blogCategoryService: BlogCategoryService) {}

  @Post()
  @Version('1')
  async create(@Body(ValidationPipe) createBlogCategoryDto: CreateBlogCategoryDto) {
    try {
      return await this.blogCategoryService.create(createBlogCategoryDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  @Version('1')
  findAll(@Pagination() pagination: PaginationDto, @Query(ValidationPipe) dto: QueryBlogCategoryDto) {
    return this.blogCategoryService.findAll(dto.search, pagination);
  }

  @Patch(':id')
  @Version('1')
  async update(@Param('id') id: string, @Body(ValidationPipe) updateBlogCategoryDto: UpdateBlogCategoryDto) {
    try {
      return await this.blogCategoryService.update(id, updateBlogCategoryDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  @Version('1')
  async remove(@Param('id') id: string) {
    try {
      return await this.blogCategoryService.remove(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
