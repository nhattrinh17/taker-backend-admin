import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpException, HttpStatus } from '@nestjs/common';
import { UploadService } from './upload.service';
import { ValidationPipe } from '@common/pipes';
import { QueryUploadGetUrl } from './dto/query-upload.dto';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Get('get-signed-url')
  async getSignedUrl(@Query(ValidationPipe) { fileName }: QueryUploadGetUrl) {
    try {
      return await this.uploadService.getSignedFileUrl(fileName);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
