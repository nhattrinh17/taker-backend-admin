import { IsString } from 'class-validator';

export class CreateOptionDto {
  @IsString()
  readonly phone: string;
}

export class CreateOptionCustomDto {
  @IsString()
  key: string;

  @IsString()
  value: string;
}
