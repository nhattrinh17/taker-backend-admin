import { Module } from '@nestjs/common';
import { CustomerAdminService } from './customer.service';
import { CustomerController } from './customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer, Trip } from '@entities/index';
import { CustomerRepository } from 'src/database/repository/customer.repository';
import { TripRepository } from 'src/database/repository/trips.repository';
import { SmsService } from '@common/index';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Trip])],
  controllers: [CustomerController],
  providers: [
    SmsService,
    CustomerAdminService,
    {
      provide: 'CustomerRepositoryInterface',
      useClass: CustomerRepository,
    },
    {
      provide: 'TripRepositoryInterface',
      useClass: TripRepository,
    },
  ],
  exports: [
    CustomerAdminService,
    {
      provide: 'CustomerRepositoryInterface',
      useClass: CustomerRepository,
    },
    {
      provide: 'TripRepositoryInterface',
      useClass: TripRepository,
    },
  ],
})
export class CustomerModule {}
