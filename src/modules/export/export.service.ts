import { headersExportCustomer, headersExportShoemaker, headersExportWithdraw } from '@common/constants/header-export';
import { PaginationDto } from '@common/decorators';
import { TransactionSource, TransactionStatus, TransactionType } from '@common/enums';
import { GoogleSheetService } from '@common/services/googleSheet.service';
import { Customer } from '@entities/customer.entity';
import { Shoemaker } from '@entities/shoemaker.entity';
import { Inject, Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { CustomerRepositoryInterface } from 'src/database/interface/customer.interface';
import { ShoemakerRepositoryInterface } from 'src/database/interface/shoemaker.interface';
import { TransactionRepositoryInterface } from 'src/database/interface/transaction.interface';
import { TripRepositoryInterface } from 'src/database/interface/trip.interface';
import { TripRatingRepositoryInterface } from 'src/database/interface/tripRate.interface';
import { Between, Like } from 'typeorm';

@Injectable()
export class ExportService {
  constructor(
    @Inject('ShoemakerRepositoryInterface')
    private readonly shoemakerRepository: ShoemakerRepositoryInterface,
    @Inject('CustomerRepositoryInterface')
    private readonly customerRepository: CustomerRepositoryInterface,
    @Inject('TripRepositoryInterface')
    private readonly tripRepository: TripRepositoryInterface,
    @Inject('TripRatingRepositoryInterface')
    private readonly tripRatingRepository: TripRatingRepositoryInterface,
    @Inject('TransactionRepositoryInterface')
    private readonly transactionRepository: TransactionRepositoryInterface,
  ) {}

  async findShoemaker(search: string, startDate: string, endDate: string, pagination: PaginationDto, sort: string, typeSort: 'ASC' | 'DESC') {
    const filter = {};
    if (startDate && endDate) {
      filter['registrationDate'] = Between(new Date(startDate).toISOString(), new Date(endDate).toISOString());
    }
    if (search) {
      filter['phone'] = Like(`%${search}%`);
    }

    const { data, pagination: paginationTg } = await this.shoemakerRepository.findAllExport(filter, pagination, sort, typeSort);

    const [dataReferrals, dataTrip, dataRate] = await Promise.all([
      //
      Promise.all(
        data.map((i) =>
          this.shoemakerRepository.count({
            referralCode: i.phone,
          }),
        ),
      ),
      this.tripRepository.getTotalOrderAndSpentByShoemaker(data.map((i) => i.id)),
      this.tripRatingRepository.getTotalRateAndAverageByShoemakerIs(data.map((i) => i.id)),
    ]);

    return {
      data: data.map((i, index) => ({
        ...i,
        trip: dataTrip[index],
        rate: dataRate[index],
        totalReferrals: dataReferrals[index],
      })),
      pagination: paginationTg,
    };
  }

  async exportShoemakerToSheet(startDate: string, endDate: string) {
    const googleSheetService = new GoogleSheetService('', `Taker-export-shoemaker ${new Date().getTime()}`);
    await googleSheetService.initialize();

    await googleSheetService.initializeSheetHeaders(headersExportShoemaker);

    // Lấy toàn bộ dữ liệu Shoemaker
    const filter = {};
    if (startDate && endDate) {
      filter['registrationDate'] = Between(new Date(startDate).toISOString(), new Date(endDate).toISOString());
    }
    const totalRecords = await this.shoemakerRepository.count(filter);
    const { data: dataShoemaker } = await this.findShoemaker(
      '',
      startDate,
      endDate,
      {
        limit: totalRecords,
        offset: 0,
        page: 1,
      },
      'registrationDate',
      'DESC',
    );

    // Xử lý dữ liệu thành mảng 2D
    const rows = dataShoemaker.map((i: Shoemaker & { trip: { totalIncome; totalOrders } } & { rate: { totalRatings; averageRating }; totalReferrals }) => [
      i.fullName,
      i.phone,
      i.isOn && i.isOnline ? 'Đang bật nhận việc' : 'Chưa bật',
      dayjs(i.registrationDate).format('YYYY-MM-DD HH:mm:ss'),
      i.wallet.balance,
      i.trip?.totalIncome || 0,
      i.trip?.totalOrders || 0,
      i.rate?.averageRating || 0,
      i.rate?.totalRatings || 0,
      i.totalReferrals || 0,
      i.accountName,
      i.accountNumber,
      i.bankName,
      i.identityCard,
      i.dateOfBirth,
      i.maritalStatus,
      i.placeOfOrigin,
      i.placeOfResidence,
      i.workRegistrationArea,
      i.email,
    ]);

    // Ghi hàng loạt vào sheet
    await googleSheetService.appendRows(0, rows);

    return googleSheetService.getLinkSheet();
  }

  async findCustomer(search: string, startDate: string, endDate: string, pagination: PaginationDto, sort: string, typeSort: 'ASC' | 'DESC') {
    const filter = {};
    if (startDate && endDate) {
      filter['registrationDate'] = Between(new Date(startDate).toISOString(), new Date(endDate).toISOString());
    }

    const { data, pagination: paginationTg } = await this.customerRepository.findAllCustom(search, filter, pagination, sort, typeSort);

    const [dataReferrals, dataTrip] = await Promise.all([
      //
      Promise.all(
        data.map((i) =>
          this.customerRepository.count({
            referralCode: i.phone,
          }),
        ),
      ),
      this.tripRepository.getTotalOrderAndSpentByCustomers(data.map((i) => i.id)),
    ]);

    return {
      data: data.map((i, index) => ({
        ...i,
        trip: dataTrip[index],

        totalReferrals: dataReferrals[index],
      })),
      pagination: paginationTg,
    };
  }

  async exportCustomerToSheet(isVerified: number, startDate: string, endDate: string) {
    const googleSheetService = new GoogleSheetService('', `Taker-export-customer ${new Date().getTime()}`);
    await googleSheetService.initialize();

    await googleSheetService.initializeSheetHeaders(headersExportCustomer);

    // Lấy toàn bộ dữ liệu Shoemaker
    const filter = {};
    if (startDate && endDate) {
      filter['registrationDate'] = Between(new Date(startDate).toISOString(), new Date(endDate).toISOString());
    }
    if (isVerified != undefined) {
      filter['isVerified'] = Boolean(isVerified);
    }
    const totalRecords = await this.customerRepository.count(filter);

    const { data, pagination: paginationTg } = await this.customerRepository.findAllCustom('', filter, { limit: totalRecords, offset: 0, page: 1 }, 'registrationDate', 'DESC');

    const [dataReferrals, dataTrip] = await Promise.all([
      //
      Promise.all(
        data.map((i) =>
          this.customerRepository.count({
            referralCode: i.phone,
          }),
        ),
      ),
      this.tripRepository.getTotalOrderAndSpentByCustomers(data.map((i) => i.id)),
    ]);

    const dataCustomer = data.map((i, index) => ({
      ...i,
      trip: dataTrip[index],

      totalReferrals: dataReferrals[index],
    }));

    // Xử lý dữ liệu thành mảng 2D
    const rows = dataCustomer.map((i: Customer & { trip: { totalSpent; totalOrders } } & { totalReferrals }) => [
      i.fullName,
      i.phone,
      dayjs(i.registrationDate).format('YYYY-MM-DD HH:mm:ss'),
      i.email,
      i.isVerified ? 'Đã xác thực' : 'Chưa xác thực',
      i.wallet.balance,
      i.trip?.totalSpent || 0,
      i.trip?.totalOrders || 0,
      i.referralCode,
      i.totalReferrals || 0,
      i.bankAccountName,
      i.bankAccountNumber,
      i.bankName,
      i.address,
    ]);

    // Ghi hàng loạt vào sheet
    await googleSheetService.appendRows(0, rows);

    return googleSheetService.getLinkSheet();
  }

  findWithdraw(startDate: string, endDate: string, pagination: PaginationDto, sort: string, typeSort: 'ASC' | 'DESC') {
    const condition = {
      transactionType: TransactionType.WITHDRAW,
      transactionSource: TransactionSource.WALLET,
    };
    if (startDate && endDate) {
      condition['createdAt'] = Between(new Date(startDate).toISOString(), new Date(endDate).toISOString());
    }

    return this.transactionRepository.findAllWidthDrawExport(condition, pagination, sort, typeSort);
  }

  async exportWithdrawToSheet(startDate: string, endDate: string) {
    // Khởi tạo dịch vụ Google Sheet
    const googleSheetService = new GoogleSheetService('', `Taker-export-withdraw ${new Date().getTime()}`);
    await googleSheetService.initialize();

    // Thiết lập tiêu đề
    await googleSheetService.initializeSheetHeaders(headersExportWithdraw);

    // Lấy dữ liệu withdraw
    const condition = {
      transactionType: TransactionType.WITHDRAW,
      transactionSource: TransactionSource.WALLET,
    };
    if (startDate && endDate) {
      condition['createdAt'] = Between(new Date(startDate).toISOString(), new Date(endDate).toISOString());
    }
    const totalRecords = await this.transactionRepository.count(condition);
    const { data, pagination: paginationTg } = await this.findWithdraw(startDate, endDate, { limit: totalRecords, offset: 0, page: 1 }, '', 'DESC');

    // Xử lý dữ liệu thành mảng 2D
    const rows = data.map((item) => {
      const shoemaker = item.wallet?.shoemaker || {};
      const customer = item.wallet?.customer || {};
      const user = item.wallet?.shoemaker ? 'Thợ giày' : 'Khách hàng';
      return [
        customer?.phone || shoemaker?.phone || '',
        customer?.fullName || shoemaker?.fullName || '',
        user,
        item.amount,
        item.description,
        dayjs(item.transactionDate).format('YYYY-MM-DD HH:mm:ss'),
        item.status == TransactionStatus.SUCCESS ? 'Đã chuyển' : 'Chưa chuyển',
        item.evidence || '',
        item.wallet?.balance || 0,
        customer?.accountNumber || shoemaker?.accountNumber || '',
        customer?.bankName || shoemaker?.bankName || '',
        customer?.bankAccountName || shoemaker?.accountName || '',
      ];
    });

    // Ghi hàng loạt vào Google Sheet
    await googleSheetService.appendRows(0, rows);

    // Trả về link Google Sheet
    return googleSheetService.getLinkSheet();
  }
}
