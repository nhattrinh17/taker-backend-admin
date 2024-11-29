import { IsOptional, IsString } from 'class-validator';

export class QueryDashboardShoe {
  @IsOptional()
  @IsString()
  startDate: string;

  @IsOptional()
  @IsString()
  endDate: string;
}

export class CreateDashboardDto {}
