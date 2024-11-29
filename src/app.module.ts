import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from 'nestjs-firebase';
import { FirebaseService } from '@common/services';
import { TypeOrmModule } from '@nestjs/typeorm';
import connectionSource, { typeOrmConfig } from './config/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ServicesModule } from '@modules/services/services.module';
import { NotificationsModule } from '@modules/notifications/notifications.module';
import { ShoemakersModule } from '@modules/shoemakers/shoemakers.module';
import { WithdrawalsModule } from '@modules/withdrawals/withdrawals.module';
import { OptionModule } from '@modules/options/options.module';
import { VoucherModule } from '@modules/voucher/voucher.module';
import { TripModule } from '@modules/trip/trip.module';
import { PointProductModule } from '@modules/point-product/point-product.module';
import { BonusPointsModule } from '@modules/bonus_points/bonus_points.module';
import { WalletsModule } from '@modules/wallets/wallets.module';
import { CustomerModule } from '@modules/customer/customer.module';
import { BlogCategoryModule } from '@modules/blog-category/blog-category.module';
import { BlogModule } from '@modules/blog/blog.module';
import { UploadModule } from '@modules/upload/upload.module';
import { ExportModule } from '@modules/export/export.module';
import { DashboardModule } from '@modules/dashboard/dashboard.module';
import { AuthenticationModule } from '@modules/authentication/authentication.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      expandVariables: true,
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        return typeOrmConfig;
      },
      dataSourceFactory: async () => {
        const dataSource = await connectionSource.initialize();
        // console.log(
        //   '🚀 ~ dataSourceFactory: ~ dataSource.isConnected:',
        //   dataSource.isConnected,
        // );
        return dataSource;
      },
    }),
    EventEmitterModule.forRoot({ verboseMemoryLeak: true }),
    AuthenticationModule,
    ServicesModule,
    NotificationsModule,
    ShoemakersModule,
    WithdrawalsModule,
    OptionModule,
    VoucherModule,
    TripModule,
    PointProductModule,
    BonusPointsModule,
    WalletsModule,
    CustomerModule,
    BlogCategoryModule,
    BlogModule,
    UploadModule,
    ExportModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService, FirebaseService],
})
export class AppModule implements OnModuleInit {
  onModuleInit() {}
}
