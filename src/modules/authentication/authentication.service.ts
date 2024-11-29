import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AppType, generateHashedPassword, ICustomer, messageResponseError, SOCKET_PREFIX, validPassword } from '@common/index';
import { Admin } from '@entities/index';

import { CreateAccountDto, LoginDto, updateInfoAdminDto } from './dto';
import RedisService from '@common/services/redis.service';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class AuthenticationService implements OnModuleInit {
  constructor(
    @InjectRepository(Admin) private readonly adminRep: Repository<Admin>,
    private readonly jwtService: JwtService,
    private readonly redis: RedisService,
  ) {}

  /**
   * This method is called when the module is initialized.
   * In this case, it checks if there are any admin accounts in the database.
   */
  async onModuleInit() {
    try {
      const admins = await this.adminRep.find();
      if (admins.length === 0) {
        const ADMIN_ACCOUNTS_USER_NAME = process.env.ADMIN_ACCOUNTS_USER_NAME;
        const ADMIN_ACCOUNTS_PASSWORD = process.env.ADMIN_ACCOUNTS_PASSWORD;
        if (ADMIN_ACCOUNTS_USER_NAME && ADMIN_ACCOUNTS_PASSWORD) {
          const admin = new Admin();
          admin.userName = ADMIN_ACCOUNTS_USER_NAME;
          admin.password = generateHashedPassword(ADMIN_ACCOUNTS_PASSWORD);
          await this.adminRep.save(admin);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  async create(dto: CreateAccountDto) {
    try {
      const admin = await this.adminRep.findOneBy({ userName: dto.userName });
      if (admin) {
        throw new Error(messageResponseError.admin.accountAlreadyExists);
      }
      dto.password = generateHashedPassword(dto.password);
      return this.adminRep.save(dto);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Function to login
   * @param phone
   * @param password
   * @returns user and token
   */
  async login({ userName, password }: LoginDto) {
    try {
      const user = await this.adminRep.findOneBy({ userName });
      if (!user) throw new BadRequestException('Invalid userName or Password');

      if (!validPassword(password, user.password)) {
        throw new BadRequestException('Invalid phone or password');
      }
      // Update status isLogin when user login
      await this.adminRep.update(user.id, { lastLoginDate: new Date() });

      const token = this.jwtService.sign({
        sub: user.id,
        type: AppType.admins,
      });
      console.log('🚀 ~ AuthenticationService ~ login ~ token:', token);
      return { token, user: { userName: user.userName, id: user.id } };
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  /**
   * Function to validate user
   * @param payload
   * @returns user
   */
  validateUser(payload: ICustomer) {
    return this.adminRep.findOneBy({ id: payload.sub });
  }

  async updateInfo(id: string, dto: updateInfoAdminDto) {
    const dataUpdate = {};
    const admin = await this.adminRep.findOneBy({ id: id });

    if (dto.fcmToken) {
      dataUpdate['fcmToken'] = dto.fcmToken;
      // delete fcmToken old in redis
      admin.fcmToken && (await this.redis.srem(`${SOCKET_PREFIX}admins-fcm-token`, admin.fcmToken));
      this.redis.sadd(`${SOCKET_PREFIX}admins-fcm-token`, dto.fcmToken);
    }
    if (dto.password) {
      if (!validPassword(dto.passwordOld, admin.password)) throw new Error(messageResponseError.admin.invalidPassword);
      dataUpdate['password'] = generateHashedPassword(dto.password);
    }
    return this.adminRep.update(id, dataUpdate);
  }
}
