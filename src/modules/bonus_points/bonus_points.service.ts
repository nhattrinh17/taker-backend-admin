import { Inject, Injectable } from '@nestjs/common';
import { CreateBonusPointDto } from './dto/create-bonus_point.dto';
import { UpdateBonusPointDto } from './dto/update-bonus_point.dto';
import { BonusPointRepositoryInterface } from 'src/database/interface/bonusPoint.interface';
import { IsNull, Or } from 'typeorm';
import { messageResponseError } from '@common/constants';
import { PaginationDto } from '@common/decorators';
import { BonusPointLogRepositoryInterface } from 'src/database/interface/bonusPointLog.interface';

@Injectable()
export class BonusPointsService {
  constructor(
    @Inject('BonusPointRepositoryInterface')
    private readonly bonusPointRepository: BonusPointRepositoryInterface,
    @Inject('BonusPointLogRepositoryInterface')
    private readonly bonusPointLogRepository: BonusPointLogRepositoryInterface,
  ) {}

  async getBlogBonusPoint(id: string, pagination: PaginationDto) {
    return this.bonusPointLogRepository.findAll(
      { bonusPointId: id },
      {
        ...pagination,
        sort: 'createdAt',
        typeSort: 'DESC',
      },
    );
  }

  async create(dto: CreateBonusPointDto) {
    try {
      if (![0, 1].includes(+dto.type) || (!dto.customerId && !dto.shoemakerId)) throw new Error(messageResponseError.bonusPoint.typeUpdateInvalid);
      const filter = dto.customerId
        ? {
            customerId: dto.customerId,
            shoemakerId: IsNull(),
          }
        : {
            customerId: IsNull(),
            shoemakerId: dto.shoemakerId,
          };
      let bonusPoint = await this.bonusPointRepository.findOneByCondition(filter);
      if (!bonusPoint) {
        bonusPoint = await this.bonusPointRepository.create({ ...dto, points: 0 });
      }

      return this.bonusPointRepository.callProcedureUpdatePoint({ bonusPointId: bonusPoint.id, description: dto.description, point: dto.points, type: dto.type });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  findAll(search: string, type: string, pagination: PaginationDto) {
    if (!type) throw new Error(messageResponseError.bonusPoint.missingTypeSearch);
    return this.bonusPointRepository.findAllSearchAndJoin(search, type, pagination);
  }
}
