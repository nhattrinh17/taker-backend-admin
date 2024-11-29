import { Module } from '@nestjs/common';
import { TripService } from './trip.service';
import { TripController } from './trip.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip, TripRating, TripCancellation } from '@entities/index';
import { TripRepository } from 'src/database/repository/trips.repository';
import { TripCancellationRepository } from 'src/database/repository/tripCancellation.repository';
import { TripRatingRepository } from 'src/database/repository/tripRate.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Trip, TripCancellation, TripRating])],
  controllers: [TripController],
  providers: [
    TripService,
    {
      provide: 'TripRepositoryInterface',
      useClass: TripRepository,
    },
    {
      provide: 'TripCancellationRepositoryInterface',
      useClass: TripCancellationRepository,
    },

    {
      provide: 'TripRatingRepositoryInterface',
      useClass: TripRatingRepository,
    },
  ],
})
export class TripModule {}
