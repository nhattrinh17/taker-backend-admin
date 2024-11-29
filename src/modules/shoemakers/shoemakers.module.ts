import { Shoemaker } from '@entities/shoemaker.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoemakersController } from './shoemakers.controller';
import { ShoemakersService } from './shoemakers.service';
import { FirebaseService, SmsService } from '@common/services';
import { ShoemakerRepository } from 'src/database/repository/shoemaker.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Shoemaker])],
  controllers: [ShoemakersController],
  providers: [
    ShoemakersService,
    FirebaseService,
    SmsService,
    {
      provide: 'ShoemakerRepositoryInterface',
      useClass: ShoemakerRepository,
    },
  ],
})
export class ShoemakersModule {}
