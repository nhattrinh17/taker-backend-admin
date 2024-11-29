import { Inject, Injectable } from '@nestjs/common';
import { CreatePointProductDto } from './dto/create-point-product.dto';
import { UpdatePointProductDto } from './dto/update-point-product.dto';
import { PointToProductRepositoryInterface } from 'src/database/interface/pointToProduct.interface';
import { messageResponseError } from '@common/constants';
import { generateSlug } from '@common/helpers';
import { PaginationDto } from '@common/decorators';
import { Like, Not } from 'typeorm';

@Injectable()
export class PointProductService {
  constructor(
    @Inject('PointToProductRepositoryInterface')
    private readonly pointToProductRepository: PointToProductRepositoryInterface,
  ) {}

  async create(dto: CreatePointProductDto) {
    if (dto.point <= 0) throw new Error(messageResponseError.pointToProduct.pointThan0);
    const slug = generateSlug(dto.name);

    const checkDuplicate = await this.pointToProductRepository.count({
      slug,
    });
    if (checkDuplicate) throw new Error(messageResponseError.pointToProduct.productAlreadyExists);
    return this.pointToProductRepository.create({ ...dto, slug });
  }

  findAll(search: string, pagination: PaginationDto) {
    const filter = {};
    if (search) {
      filter['name'] = Like(`%${search}%`);
    }
    return this.pointToProductRepository.findAll(filter, {
      ...pagination,
    });
  }

  findOne(id: string) {
    return this.pointToProductRepository.findOneById(id);
  }

  async update(id: string, dto: UpdatePointProductDto) {
    if (dto.point <= 0) throw new Error(messageResponseError.pointToProduct.pointThan0);
    const product = await this.findOne(id);
    if (!product) throw new Error(messageResponseError.pointToProduct.notFound);
    const slug = generateSlug(dto.name);
    if (dto.name != product.name) {
      const checkDuplicate = await this.pointToProductRepository.count({
        slug,
        id: Not(id),
      });
      if (checkDuplicate) throw new Error(messageResponseError.pointToProduct.productAlreadyExists);
    }
    return this.pointToProductRepository.findByIdAndUpdate(id, { ...dto, slug });
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    if (!product) throw new Error(messageResponseError.pointToProduct.notFound);
    return this.pointToProductRepository.permanentlyDelete(id);
  }
}
