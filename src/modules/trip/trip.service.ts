import { Inject, Injectable } from '@nestjs/common';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { TripRepositoryInterface } from 'src/database/interface/trip.interface';
import { PaginationDto } from '@common/decorators';
import { IPeriod, TypeFilterTripAdmin } from '@common/constants';
import { TripCancellationRepositoryInterface } from 'src/database/interface/tripCancellation.interface';
import { PaymentEnum, StatusEnum } from '@common/enums';
import { And, Between, In, IsNull, LessThanOrEqual, MoreThanOrEqual, Not } from 'typeorm';
import { getDatesByWeekOrMonth } from '@common/helpers';
import { TripRatingRepositoryInterface } from 'src/database/interface/tripRate.interface';
import { GoogleSheetService } from '@common/services/googleSheet.service';
import { headersExportRankingActivity, headersExportRankingIncome, headersExportRankingPerformance, headersExportTripCancel, headersExportTripSuccess } from '@common/constants/header-export';
import { Trip } from '@entities/trip.entity';
import dayjs from 'dayjs';

@Injectable()
export class TripService {
  constructor(
    @Inject('TripRepositoryInterface')
    private readonly tripRepository: TripRepositoryInterface,
    @Inject('TripCancellationRepositoryInterface')
    private tripCancellationRepository: TripCancellationRepositoryInterface,
    @Inject('TripRatingRepositoryInterface')
    private tripRatingRepository: TripRatingRepositoryInterface,
  ) {}

  async findAll(typeFilter: string, pagination: PaginationDto, startDate: string, endDate: string, sort: string, typeSort: 'ASC' | 'DESC', isExport = 0) {
    const filter = {};
    // Lọc đơn hàng thành công
    if (typeFilter == TypeFilterTripAdmin.complete) {
      filter['status'] = StatusEnum.COMPLETED;
      if (startDate && endDate) {
        filter['createdAt'] = Between(new Date(startDate).toISOString(), new Date(endDate).toISOString());
      }
      if (isExport) {
        const totalRecode = await this.tripRepository.count(filter);
        pagination.limit = totalRecode;
        pagination.offset = 0;
        pagination.page = 1;
      }
      const { data, pagination: paginationAndTotal } = await this.tripRepository.getTripByConditionAndJoin(filter, pagination, sort, typeSort);
      const dataRate = await Promise.all(
        data.map((i) =>
          this.tripRatingRepository.findOneByCondition(
            {
              tripId: i.id,
            },
            ['comment', 'rating'],
          ),
        ),
      );
      if (!isExport)
        return {
          data: data.map((i, index) => {
            return {
              ...i,
              rate: dataRate[index],
            };
          }),
          pagination: paginationAndTotal,
        };
      else {
        const dataExport = data.map((i, index) => {
          return {
            ...i,
            rate: dataRate[index],
          };
        });
        const googleSheetService = new GoogleSheetService('', `Taker-export-trip-success ${new Date().getTime()}`);
        await googleSheetService.initialize();

        // Thiết lập tiêu đề
        await googleSheetService.initializeSheetHeaders(headersExportTripSuccess);
        const rows = dataExport.map((item) => {
          const shoemaker = item?.shoemaker || {};
          const customer = item?.customer || {};
          const rate = item?.rate || {};
          return [
            customer?.fullName,
            customer?.phone,
            shoemaker?.fullName,
            shoemaker?.phone,
            item.date,
            item.address,
            item.totalPrice,
            item.fee,
            item.income,
            item.paymentMethod == PaymentEnum.DIGITAL_WALLET ? 'Ví Taker' : item.paymentMethod == PaymentEnum.OFFLINE_PAYMENT ? 'Trực tiếp' : 'VN Pay',
            rate?.rating,
            rate?.comment,
          ];
        });

        // Ghi hàng loạt vào Google Sheet
        await googleSheetService.appendRows(0, rows);

        // Trả về link Google Sheet
        return googleSheetService.getLinkSheet();
      }
    }
    // Lọc đơn đang tìm kiếm thợ
    else if (typeFilter == TypeFilterTripAdmin.findShoemaker) {
      if (startDate && endDate) {
        filter['createdAt'] = Between(new Date(startDate).toISOString(), new Date(endDate).toISOString());
      }
      filter['status'] = StatusEnum.SEARCHING;
      return this.tripRepository.getTripByConditionAndJoin(filter, pagination, sort, typeSort);
    }
    // Lọc thợ hủy đơn
    else if (typeFilter == TypeFilterTripAdmin.shoemakerCannel || typeFilter == TypeFilterTripAdmin.customerCancel) {
      if (startDate && endDate) {
        filter['createdAt'] = Between(new Date(startDate).toISOString(), new Date(endDate).toISOString());
      } else if (!startDate && !endDate && isExport) {
        const currentDate = new Date();
        filter['createdAt'] = Between(new Date(currentDate.getTime() - 1000 * 60 * 60 * 24 * 10).toISOString(), currentDate.toISOString());
      }
      if (typeFilter == TypeFilterTripAdmin.shoemakerCannel) filter['customerId'] = IsNull();
      else filter['shoemakerId'] = IsNull();
      if (isExport) {
        const totalRecode = await this.tripCancellationRepository.count(filter);
        pagination.limit = totalRecode;
        pagination.offset = 0;
        pagination.page = 1;
      }
      const { data, pagination: paginationTg } = await this.tripCancellationRepository.getTripCannelByConditionAndJoin(filter, pagination);
      if (isExport) {
        const googleSheetService = new GoogleSheetService('', `Taker-export-trip-${typeFilter == TypeFilterTripAdmin.customerCancel ? 'customer' : 'shoemaker'}-cancel ${new Date().getTime()}`);
        await googleSheetService.initialize();

        // Thiết lập tiêu đề
        await googleSheetService.initializeSheetHeaders(headersExportTripCancel);
        const rows = data.map((item) => {
          const shoemaker = item?.shoemaker || {};
          const customer = item?.customer || {};
          const trip: Trip = item?.trip || {};
          return [
            customer?.fullName || shoemaker?.fullName,
            customer?.phone || shoemaker?.phone,
            trip.date,
            dayjs(item.createdAt).format('YYYY-MM-DD'),
            item.reason,
            trip.address,
            trip.totalPrice,
            trip.fee,
            trip.income,
            trip.paymentMethod == PaymentEnum.DIGITAL_WALLET ? 'Ví Taker' : trip.paymentMethod == PaymentEnum.OFFLINE_PAYMENT ? 'Trực tiếp' : 'VN Pay',
          ];
        });

        // Ghi hàng loạt vào Google Sheet
        await googleSheetService.appendRows(0, rows);

        // Trả về link Google Sheet
        return googleSheetService.getLinkSheet();
      } else {
        return {
          data,
          pagination: paginationTg,
        };
      }
    }

    return false;
  }

  findTripPending(pagination: PaginationDto) {
    const condition = {
      status: In([StatusEnum.SEARCHING, StatusEnum.ACCEPTED, StatusEnum.MEETING, StatusEnum.INPROGRESS]),
    };
    return this.tripRepository.getTripByConditionAndJoin(condition, pagination);
  }

  async getTripById(id: string) {
    return this.tripRepository.getTripByIdAndJoin(id);
  }

  async getRankingShoemaker(limit: number, period: IPeriod, isExport: number) {
    const dates = getDatesByWeekOrMonth(period);

    const condition = {
      date: In(dates),
      status: StatusEnum.COMPLETED,
    };

    const data = await this.tripRepository.getShoemakerTopIncome(condition, limit || 10);
    if (isExport) {
      const googleSheetService = new GoogleSheetService('', `Taker-export-ranking-income ${new Date().getTime()}`);
      await googleSheetService.initialize();

      // Thiết lập tiêu đề
      await googleSheetService.initializeSheetHeaders(headersExportRankingIncome);

      const rows = data.map((item) => {
        return [item.shoemakerName, item.shoemakerPhone, item.totalIncome, item.totalOrders];
      });

      // Ghi hàng loạt vào Google Sheet
      await googleSheetService.appendRows(0, rows);

      // Trả về link Google Sheet
      return googleSheetService.getLinkSheet();
    }
    return data;
  }

  async getRankingActivityShoemaker(limit: number, period: IPeriod, isExport: number) {
    const dates = getDatesByWeekOrMonth(period);

    const condition = {
      date: In(dates),
      shoemakerId: Not(IsNull()),
    };

    const shoemaker = await this.tripRepository.getShoemakerTopActivity(condition, limit || 10);

    const shoemakerCancel = await Promise.all(
      shoemaker.map((i) =>
        this.tripCancellationRepository.count({
          shoemakerId: i.shoemakerId,
          createdAt: And(MoreThanOrEqual(new Date(dates[0]).toISOString()), LessThanOrEqual(new Date(dates[dates.length - 1]).toISOString())),
        }),
      ),
    );
    const data = shoemaker.map((i, index) => ({ ...i, totalCancel: shoemakerCancel[index] }));

    if (isExport) {
      const googleSheetService = new GoogleSheetService('', `Taker-export-ranking-activity ${new Date().getTime()}`);
      await googleSheetService.initialize();
      // Thiết lập tiêu đề
      await googleSheetService.initializeSheetHeaders(headersExportRankingActivity);
      const rows = data.map((item) => {
        return [item.shoemakerName, item.shoemakerPhone, item.totalReceiver, item.totalCompleted, item.totalCancel];
      });
      // Ghi hàng loạt vào Google Sheet
      await googleSheetService.appendRows(0, rows);
      // Trả về link Google Sheet
      return googleSheetService.getLinkSheet();
    }
    return data;
  }

  async getRankingPerformanceShoemaker(limit: number, period: IPeriod, isExport: number) {
    const dates = getDatesByWeekOrMonth(period);

    const condition = {
      createdAt: And(MoreThanOrEqual(new Date(dates[0]).toISOString()), LessThanOrEqual(new Date(dates[dates.length - 1]).toISOString())),
    };

    const data = await this.tripRatingRepository.getAvengeRateShoemakersByCondition(condition, limit || 10);

    if (isExport) {
      const googleSheetService = new GoogleSheetService('', `Taker-export-ranking-performance ${new Date().getTime()}`);
      await googleSheetService.initialize();
      // Thiết lập tiêu đề
      await googleSheetService.initializeSheetHeaders(headersExportRankingPerformance);
      const rows = data.map((item) => {
        return [item.shoemakerName, item.shoemakerPhone, dayjs(item.shoemakerRegistrationDate).format('YYYY-MM-DD'), item.averageRating];
      });
      // Ghi hàng loạt vào Google Sheet
      await googleSheetService.appendRows(0, rows);
      // Trả về link Google Sheet
      return googleSheetService.getLinkSheet();
    }
    return data;
  }
}
