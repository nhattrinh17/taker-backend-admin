import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePointProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  type: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  point: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  rate: number;
}
