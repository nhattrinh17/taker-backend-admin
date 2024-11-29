import { AdminsAuthGuard } from '@common/guards/admins.guard';
import { ValidationPipe } from '@common/pipes/validation.pipe';
import { S3Service } from '@common/services/s3.service';
import { BadRequestException, Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query, UseGuards, Version } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { SearchCountDto, SearchNotificationDto, SearchNotificationDtoV2 } from './dto/search-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationService } from './notifications.service';
import { Pagination, PaginationDto } from '@common/decorators';

@UseGuards(AdminsAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly service: NotificationService,
    private s3: S3Service,
  ) {}

  @Version('1')
  @Post()
  async create(@Body(ValidationPipe) dto: CreateNotificationDto) {
    return this.service.create(dto);
  }

  @Version('1')
  @Get('')
  getAll(@Pagination() pagination: PaginationDto, @Query(ValidationPipe) filter: SearchNotificationDtoV2) {
    return this.service.findAll(filter.isSent, filter.time, pagination);
  }

  @Version('1')
  @Post('list')
  list(@Query(ValidationPipe) filter: SearchNotificationDto) {
    return this.service.findList(filter);
  }

  @Version('1')
  @Post('countRecords')
  countRecords(@Query(ValidationPipe) filter: SearchCountDto) {
    return this.service.countRecords(filter);
  }

  @Version('1')
  @Get('getSignedUrl')
  getSignedUrl(@Query() query) {
    try {
      return this.s3.getSignedFileUrl(`notifications/${query.fileName}`);
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  @Version('1')
  @Get(':id')
  async show(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.show(id);
  }

  @Version('1')
  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.delete(id);
  }

  @Version('1')
  @Put(':id')
  async update(@Param('id', new ParseUUIDPipe()) id: string, @Body(new ValidationPipe()) dto: UpdateNotificationDto) {
    return this.service.update(dto, id);
  }
}
