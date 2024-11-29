import { Inject, Injectable } from '@nestjs/common';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
import { UpdateBlogCategoryDto } from './dto/update-blog-category.dto';
import { generateSlug } from '@common/helpers';
import { messageResponseError } from '@common/constants';
import { PaginationDto } from '@common/decorators';
import { Like, Not } from 'typeorm';
import { BlogCategoryRepositoryInterface } from 'src/database/interface/blogCategory.interface';

@Injectable()
export class BlogCategoryService {
  constructor(
    @Inject('BlogCategoryRepositoryInterface')
    private readonly blogCategoryRepository: BlogCategoryRepositoryInterface,
  ) {}

  async create(dto: CreateBlogCategoryDto) {
    const slug = generateSlug(dto.name);
    const checkExists = await this.blogCategoryRepository.count({ slug });
    const order = await this.blogCategoryRepository.count();
    if (checkExists) throw new Error(messageResponseError.blogCate.duplicate);
    return this.blogCategoryRepository.create({ ...dto, slug, order: order + 1 });
  }

  findAll(search: string, pagination: PaginationDto) {
    const condition = {};
    if (search) condition['name'] = Like(`%${search}%`);
    return this.blogCategoryRepository.findAll(condition, { ...pagination, sort: 'order', typeSort: 'DESC' });
  }

  count(condition: object) {
    return this.blogCategoryRepository.count(condition);
  }

  async update(id: string, dto: UpdateBlogCategoryDto) {
    const blogCategory = await this.blogCategoryRepository.findOneById(id);
    if (!blogCategory) throw new Error(messageResponseError.blogCate.notFound);
    if (blogCategory.name != dto.name) {
      const slug = generateSlug(dto.name);
      const checkExists = await this.blogCategoryRepository.count({ slug, id: Not(id) });
      if (checkExists) throw new Error(messageResponseError.blogCate.duplicate);
    }
    if (dto.order != blogCategory.order) {
      await this.blogCategoryRepository.findOneAndUpdate({ order: Number(dto.order) }, { order: dto.order });
    }

    return this.blogCategoryRepository.findByIdAndUpdate(id, dto);
  }

  async remove(id: string) {
    const blogCategory = await this.blogCategoryRepository.findOneById(id);
    if (!blogCategory) throw new Error(messageResponseError.blogCate.notFound);
    return this.blogCategoryRepository.permanentlyDelete(id);
  }
}
