import { Module } from '@nestjs/common';
import { ExportService } from './export.service';
import { ExportController } from './export.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer, Shoemaker, Transaction, Trip, TripRating } from '@entities/index';
import { ShoemakerRepository } from 'src/database/repository/shoemaker.repository';
import { TripRepository } from 'src/database/repository/trips.repository';
import { TripRatingRepository } from 'src/database/repository/tripRate.repository';
import { TransactionRepository } from 'src/database/repository/transaction.repository';
import { CustomerRepository } from 'src/database/repository/customer.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Shoemaker, Trip, TripRating, Transaction])],
  controllers: [ExportController],
  providers: [
    ExportService,
    {
      provide: 'ShoemakerRepositoryInterface',
      useClass: ShoemakerRepository,
    },
    {
      provide: 'TripRepositoryInterface',
      useClass: TripRepository,
    },
    {
      provide: 'TripRatingRepositoryInterface',
      useClass: TripRatingRepository,
    },
    {
      provide: 'TransactionRepositoryInterface',
      useClass: TransactionRepository,
    },
    {
      provide: 'CustomerRepositoryInterface',
      useClass: CustomerRepository,
    },
  ],
})
export class ExportModule {}
