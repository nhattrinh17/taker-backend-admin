import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Version, HttpException, HttpStatus, Query } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { AdminsAuthGuard } from '@common/guards';
import { ValidationPipe } from '@common/pipes';
import { Pagination, PaginationDto } from '@common/decorators';
import { QueryBlogDto } from './dto/query-blog.dto';

@Controller('blog')
@UseGuards(AdminsAuthGuard)
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @Version('1')
  async create(@Body(ValidationPipe) createBlogDto: CreateBlogDto) {
    try {
      return await this.blogService.create(createBlogDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  @Version('1')
  findAll(@Pagination() pagination: PaginationDto, @Query(ValidationPipe) query: QueryBlogDto) {
    return this.blogService.findAll(query.search, query.blogCategoryId, pagination);
  }

  @Patch(':id')
  @Version('1')
  async update(@Param('id') id: string, @Body(ValidationPipe) updateBlogDto: UpdateBlogDto) {
    try {
      return await this.blogService.update(id, updateBlogDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  @Version('1')
  async remove(@Param('id') id: string) {
    try {
      return await this.blogService.remove(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
