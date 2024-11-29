import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { Service } from '@entities/index';
import { CreateServiceDto } from './dto';
import { PaginationDto } from '@common/decorators';
import { ServiceRepositoryInterface } from 'src/database/interface/service.interface';
import { messageResponseError } from '@common/constants';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service) private readonly serviceRep: Repository<Service>,

    @Inject('ServiceRepositoryInterface')
    private readonly serviceRepository: ServiceRepositoryInterface,
  ) {}

  /**
   * Function to create a new service
   * @param createServiceDto CreateServiceDto
   * @returns Promise<Service>
   */
  async create(dto: CreateServiceDto): Promise<Service> {
    try {
      const service = await this.serviceRep.findOneBy({ name: dto.name });
      if (service) {
        throw new Error('Service already exists');
      }
      if (dto.discount) {
        dto.discountPrice = dto.price & (dto.discount / 100);
      } else {
        dto.discountPrice = 0;
      }
      return this.serviceRep.save(dto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(search: string, pagination: PaginationDto) {
    const filter = {};
    if (search) {
      filter['name'] = Like(`%${search}%`);
    }

    return this.serviceRepository.findAll(filter, {
      ...pagination,
    });
  }

  async update(id: string, dto: CreateServiceDto) {
    const service = await this.serviceRepository.findOneById(id);
    if (!service) {
      throw new Error(messageResponseError.service.notFound);
    }
    return this.serviceRepository.findByIdAndUpdate(id, dto);
  }

  async delete(id: string) {
    const service = await this.serviceRepository.findOneById(id);
    if (!service) {
      throw new Error(messageResponseError.service.notFound);
    }
    return this.serviceRepository.permanentlyDelete(id);
  }
}
