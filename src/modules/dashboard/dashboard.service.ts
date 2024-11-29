import { Inject, Injectable } from '@nestjs/common';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { TripRepositoryInterface } from 'src/database/interface/trip.interface';
import { TripServiceRepositoryInterface } from 'src/database/interface/tripService.interface';

@Injectable()
export class DashboardService {
  constructor(
    @Inject('TripServiceRepositoryInterface')
    private readonly tripServiceRepository: TripServiceRepositoryInterface,
  ) {}

  async findDashboardShoe(startDate: string, endDate: string) {
    const data: any[] = await this.tripServiceRepository.getDataDashboard(startDate, endDate);
    const totalOrders = data.reduce((pre, i) => {
      return pre + Number(i.totalOrders);
    }, 0);

    const totalRevenue = data.reduce((pre, i) => {
      return pre + Number(i.totalRevenue);
    }, 0);

    return {
      totalOrders,
      totalRevenue,
      detail: data,
    };
  }
}
