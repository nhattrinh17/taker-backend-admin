import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateWalletShoemakerDto {
  @IsString()
  walletId: string;

  @IsString()
  description: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  amount: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  type: number;
}
