import { Transaction } from '@entities/transaction.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WithdrawalsController } from './withdrawals.controller';
import { WithdrawalsService } from './withdrawals.service';
import { TransactionRepository } from 'src/database/repository/transaction.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  controllers: [WithdrawalsController],
  providers: [
    WithdrawalsService,
    {
      provide: 'TransactionRepositoryInterface',
      useClass: TransactionRepository,
    },
  ],
})
export class WithdrawalsModule {}
