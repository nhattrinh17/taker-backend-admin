import { Module } from '@nestjs/common';
import { PointProductService } from './point-product.service';
import { PointProductController } from './point-product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointToProduct } from '@entities/index';
import { PointToProductRepository } from 'src/database/repository/pointToProduct.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PointToProduct])],
  controllers: [PointProductController],
  providers: [
    PointProductService,
    {
      provide: 'PointToProductRepositoryInterface',
      useClass: PointToProductRepository,
    },
  ],
})
export class PointProductModule {}
