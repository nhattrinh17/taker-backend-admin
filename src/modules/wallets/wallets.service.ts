import { Inject, Injectable } from '@nestjs/common';
import { WalletRepositoryInterface } from 'src/database/interface/wallet.interface';
import { WalletLogRepositoryInterface } from 'src/database/interface/walletLog.interface';
import { PaginationDto } from '@common/decorators';
import { UpdateWalletShoemakerDto } from './dto/create-wallet.dto';
import { IsNull } from 'typeorm';
import { messageResponseError } from '@common/constants';

@Injectable()
export class WalletsService {
  constructor(
    @Inject('WalletRepositoryInterface')
    private readonly walletRepository: WalletRepositoryInterface,
    @Inject('WalletLogRepositoryInterface')
    private readonly walletLogRepository: WalletLogRepositoryInterface,
  ) {}
  async updateWallet(dto: UpdateWalletShoemakerDto) {
    try {
      if (!dto.walletId) throw new Error(messageResponseError.wallet.missingIdWallet);
      const wallet = await this.walletRepository.findOneByCondition({ id: dto.walletId });
      if (!wallet) throw new Error(messageResponseError.wallet.notFound);
      const updateWallet = await this.walletRepository.callProcedureUpdateWallet({
        amount: dto.amount,
        description: dto.description,
        type: dto.type,
        walletId: wallet.id,
      });
      return 'Update wallet successfully';
    } catch (error) {
      throw new Error(error.message);
    }
  }

  findAll(type: 'customer' | 'shoemaker', search: string, pagination: PaginationDto) {
    return this.walletRepository.findAllAndJoin(type, search, pagination);
  }

  findAllWalletLog(walletId: string, pagination: PaginationDto) {
    if (!walletId) return null;
    const filter: any = { walletId };
    console.log('🚀 ~ WalletsService ~ findAllWalletLog ~ filter:', filter);
    return this.walletLogRepository.findAll(filter, {
      ...pagination,
    });
  }
}
