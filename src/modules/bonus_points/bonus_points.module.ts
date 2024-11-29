import { Module } from '@nestjs/common';
import { BonusPointsService } from './bonus_points.service';
import { BonusPointsController } from './bonus_points.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BonusPoint, BonusPointLog } from '@entities/index';
import { BonusPointRepository } from 'src/database/repository/bonusPoint.repository';
import { BonusPointLogRepository } from 'src/database/repository/bonusPointLog.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BonusPoint, BonusPointLog])],
  controllers: [BonusPointsController],
  providers: [
    BonusPointsService,
    {
      provide: 'BonusPointRepositoryInterface',
      useClass: BonusPointRepository,
    },
    {
      provide: 'BonusPointLogRepositoryInterface',
      useClass: BonusPointLogRepository,
    },
  ],
})
export class BonusPointsModule {}
