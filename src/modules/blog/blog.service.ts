import { Inject, Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogRepositoryInterface } from 'src/database/interface/blog.interface';
import { BlogCategoryService } from '@modules/blog-category/blog-category.service';
import { messageResponseError, TypePressBlog } from '@common/constants';
import { generateSlug } from '@common/helpers';
import { PaginationDto } from '@common/decorators';
import { Like, Not } from 'typeorm';

@Injectable()
export class BlogService {
  constructor(
    @Inject('BlogRepositoryInterface')
    private readonly blogRepository: BlogRepositoryInterface,
    private readonly blogCategoryService: BlogCategoryService,
  ) {}

  async create(dto: CreateBlogDto) {
    if (dto.typePress == TypePressBlog.NAVIGATION && (!dto.screenCustomer || !dto.screenShoemaker)) throw new Error(messageResponseError.blog.missingDataScreen);
    if (dto.typePress == TypePressBlog.REDIRECT_WEB && (!dto.title || !dto.linkNavigate)) throw new Error(messageResponseError.blog.missingDataRedirect);
    const blogCategory = this.blogCategoryService.count({
      id: dto.blogCategoryId,
    });
    if (!blogCategory) throw new Error(messageResponseError.blogCate.notFound);
    const slug = generateSlug(dto.name);
    const checkExists = await this.blogRepository.count({ slug });
    if (checkExists) throw new Error(messageResponseError.blog.duplicate);
    const order = await this.blogRepository.count();
    return this.blogRepository.create({ ...dto, slug, order: order + 1 });
  }

  findAll(search: string, blogCategoryId: string, pagination: PaginationDto) {
    const condition = {};
    if (blogCategoryId) condition['blogCategoryId'] = blogCategoryId;
    if (search) condition['name'] = Like(`%${search}%`);
    return this.blogRepository.findAll(condition, {
      ...pagination,
    });
  }

  async update(id: string, dto: UpdateBlogDto) {
    const blog = await this.blogRepository.findOneById(id);
    if (!blog) throw new Error(messageResponseError.blogCate.notFound);
    // update slug
    if (blog.name != dto.name) {
      const slug = generateSlug(dto.name);
      const checkExists = await this.blogRepository.count({ slug, id: Not(id) });
      if (checkExists) throw new Error(messageResponseError.blog.duplicate);
    }
    // update isPromotion
    if (dto.isPromotion) {
      await this.blogRepository.findOneAndUpdate({}, { isPromotion: false });
    }
    // update order
    if (dto.order != blog.order) {
      await this.blogRepository.findOneAndUpdate({ order: Number(dto.order) }, { order: dto.order });
    }

    return this.blogRepository.findByIdAndUpdate(id, dto);
  }

  async remove(id: string) {
    const blogCategory = await this.blogRepository.findOneById(id);
    if (!blogCategory) throw new Error(messageResponseError.blog.notFound);
    return this.blogRepository.permanentlyDelete(id);
  }
}
