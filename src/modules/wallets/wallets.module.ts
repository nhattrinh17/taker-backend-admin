import { Module } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { WalletsController } from './wallets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet, WalletLog } from '@entities/index';
import { WalletRepository } from 'src/database/repository/wallet.repository';
import { WalletLogRepository } from 'src/database/repository/walletLog.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, WalletLog])],
  controllers: [WalletsController],
  providers: [
    WalletsService,
    {
      provide: 'WalletRepositoryInterface',
      useClass: WalletRepository,
    },
    {
      provide: 'WalletLogRepositoryInterface',
      useClass: WalletLogRepository,
    },
  ],
})
export class WalletsModule {}
