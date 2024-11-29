import { PaginationDto } from '@common/decorators';
import { IsOptional, IsString } from 'class-validator';

export class QueryFindWallet extends PaginationDto {
  @IsString()
  type: 'customer' | 'shoemaker';

  @IsOptional()
  @IsString()
  search: string;
}

export class QueryFindWalletLogs extends PaginationDto {
  @IsString()
  walletId: string;
}
