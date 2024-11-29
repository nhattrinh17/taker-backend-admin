import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripService } from '@entities/index';
import { TripServiceRepository } from 'src/database/repository/tripService.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TripService])],
  controllers: [DashboardController],
  providers: [
    DashboardService,
    {
      provide: 'TripServiceRepositoryInterface',
      useClass: TripServiceRepository,
    },
  ],
})
export class DashboardModule {}
