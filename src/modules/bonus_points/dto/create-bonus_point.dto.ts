import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBonusPointDto {
  @IsOptional()
  @IsString()
  customerId: string;

  @IsOptional()
  @IsString()
  shoemakerId: string;

  @IsString()
  description: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  points: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  type: number;
}
