import { Inject, Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerRepositoryInterface } from 'src/database/interface/customer.interface';
import { PaginationDto } from '@common/decorators';
import { Between, IsNull, LessThanOrEqual, Like } from 'typeorm';
import { TripRepositoryInterface } from 'src/database/interface/trip.interface';
import { messageResponseError } from '@common/constants';
import { generateHashedPassword, generatePassword, makePhoneNumber } from '@common/helpers';
import { SmsService } from '@common/index';
import { GoogleSheetService } from '@common/services/googleSheet.service';
import { headersExportCustomerDataOrder, headersExportCustomerLogin, headersExportCustomerNoOrder } from '@common/constants/header-export';
import dayjs from 'dayjs';

@Injectable()
export class CustomerAdminService {
  constructor(
    @Inject('CustomerRepositoryInterface')
    private readonly customerRepository: CustomerRepositoryInterface,
    @Inject('TripRepositoryInterface')
    private readonly tripRepository: TripRepositoryInterface,
    private readonly smsService: SmsService,
  ) {}

  getIdAllCustomer() {
    return this.customerRepository.getIdAllCustomer();
  }

  async getAll(search: string, referralCode: string, isVerified: number, newUser: number, pagination: PaginationDto, sort: string, typeSort: 'ASC' | 'DESC') {
    const filter = {};

    if (isVerified >= 0) filter['isVerified'] = isVerified;
    if (newUser >= 0) filter['newUser'] = newUser;
    if (referralCode) filter['referralCode'] = Like(`%${referralCode}%`);

    const { data: dataCustomer, pagination: paginationTg } = await this.customerRepository.findAllCustom(search, filter, pagination, sort, typeSort);
    const customerIds = [];
    dataCustomer?.map((customer) => {
      if (customer.isVerified) customerIds.push(customer.id);
    });
    const dataOrder = customerIds.length ? await this.tripRepository.getTotalOrderAndSpentByCustomers(customerIds) : [];
    const data = dataCustomer.map((customer) => {
      const stats = dataOrder.find((stat) => stat.customerId === customer.id) || { totalSpent: 0, totalOrders: 0 };
      return { ...customer, orderStats: { totalSpent: stats.totalSpent, totalOrders: stats.totalOrders } };
    });

    return {
      data,
      pagination: paginationTg,
    };
  }

  async getCustomerLongTimeLogin(days: number, pagination: PaginationDto, isExport: number) {
    const filter = [
      {
        isVerified: true,
        lastLoginDate: LessThanOrEqual(new Date(new Date().getTime() - days * 24 * 60 * 60 * 1000)),
      },
      {
        isVerified: true,
        lastLoginDate: IsNull(),
      },
    ];

    const { data, pagination: paginationTg } = await this.customerRepository.findAll(filter, {
      ...pagination,
      projection: ['id', 'phone', 'fullName', 'referralCode', 'registrationDate', 'lastLoginDate'],
    });
    if (isExport) {
      const googleSheetService = new GoogleSheetService('', `Taker-export-customer-long-time-login ${new Date().getTime()}`);
      await googleSheetService.initialize();

      // Thiết lập tiêu đề
      await googleSheetService.initializeSheetHeaders(headersExportCustomerLogin);

      const rows = data.map((item) => {
        return [item.fullName, item.phone, item.referralCode, dayjs(item.registrationDate).format('YYYY-MM-DD HH:mm:ss'), dayjs(item.lastLoginDate).format('YYYY-MM-DD HH:mm:ss')];
      });

      // Ghi hàng loạt vào Google Sheet
      await googleSheetService.appendRows(0, rows);

      // Trả về link Google Sheet
      return googleSheetService.getLinkSheet();
    }
    return {
      data,
      pagination: paginationTg,
    };
  }

  async findCustomersLongTimeNoOrder(days: number, pagination: PaginationDto, isExport: number) {
    const { data, pagination: paginationTg } = await this.customerRepository.findCustomersLongTimeNoOrder(days | 0, pagination);
    if (isExport) {
      const googleSheetService = new GoogleSheetService('', `Taker-export-customer-long-time-order ${new Date().getTime()}`);
      await googleSheetService.initialize();

      // Thiết lập tiêu đề
      await googleSheetService.initializeSheetHeaders(headersExportCustomerNoOrder);

      const rows = data.map((item) => {
        return [item.fullName, item.phone, dayjs(item.registrationDate).format('YYYY-MM-DD HH:mm:ss'), dayjs(item.lastLoginDate).format('YYYY-MM-DD HH:mm:ss')];
      });

      // Ghi hàng loạt vào Google Sheet
      await googleSheetService.appendRows(0, rows);

      // Trả về link Google Sheet
      return googleSheetService.getLinkSheet();
    }
    return {
      data,
      pagination: paginationTg,
    };
  }

  async findAllWithDataOrder(totalOrder: number, minPrice: number, pagination: PaginationDto, sort: string, typeSort: 'ASC' | 'DESC', isExport: number) {
    const { data, pagination: paginationTg } = await this.customerRepository.findAllWithDataOrder(totalOrder || 1, minPrice || 0, pagination, sort, typeSort);
    if (isExport) {
      const googleSheetService = new GoogleSheetService('', `Taker-export-customer-spending ${new Date().getTime()}`);
      await googleSheetService.initialize();

      // Thiết lập tiêu đề
      await googleSheetService.initializeSheetHeaders(headersExportCustomerDataOrder);

      const rows = data.map((item) => {
        return [item.fullName, item.phone, item.referralCode, item.totalOrders, item.totalSpent, dayjs(item.registrationDate).format('YYYY-MM-DD HH:mm:ss'), dayjs(item.lastLoginDate).format('YYYY-MM-DD HH:mm:ss')];
      });

      // Ghi hàng loạt vào Google Sheet
      await googleSheetService.appendRows(0, rows);

      // Trả về link Google Sheet
      return googleSheetService.getLinkSheet();
    }
    return {
      data,
      pagination: paginationTg,
    };
  }

  getUserDownloadStatics(startDate: string, endDate: string) {
    const condition = {};
    if (startDate && endDate) {
      condition['registrationDate'] = Between(new Date(startDate), new Date(endDate));
    }
    return this.customerRepository.getUserDownloadStatics(condition);
  }

  async updateInfoCustomer(id: string, dto: UpdateCustomerDto) {
    const customer = await this.customerRepository.findOneById(id);
    if (!customer) throw new Error(messageResponseError.customer.notFound);
    const dataUpdate = {
      fullName: dto.fullName,
      bankName: dto.bankName,
      bankAccountNumber: dto.bankAccountNumber,
      bankAccountName: dto.bankAccountName,
      address: dto.address,
    };
    await this.customerRepository.findByIdAndUpdate(id, dataUpdate);
    return 'Update customer information successfully';
  }

  async resetPassword(id: string) {
    try {
      const customer = await this.customerRepository.findOneById(id);
      if (!customer) throw new Error(messageResponseError.customer.notFound);
      const password = generatePassword();
      await this.customerRepository.findByIdAndUpdate(id, {
        password: generateHashedPassword(password.toString()),
      });
      const phoneNumber = makePhoneNumber(customer.phone);
      await this.smsService.send({
        toNumber: phoneNumber,
        otp: password.toString(),
      });

      return 'Password reset successfully';
    } catch (error) {
      console.log('🚀 ~ CustomerAdminService ~ resetPassword ~ error:', error);
    }
  }
}
