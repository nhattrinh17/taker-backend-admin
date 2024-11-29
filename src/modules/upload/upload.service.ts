import { Inject, Injectable } from '@nestjs/common';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { S3Service } from '@common/index';

@Injectable()
export class UploadService {
  constructor(private readonly s3Service: S3Service) {}
  /**
   * Function to get signed file url
   * @param fileName
   * @returns signed file url
   */
  async getSignedFileUrl(fileName: string) {
    if (!fileName) throw new Error('File name is required');
    const res = this.s3Service.getSignedFileUrl(fileName);
    return res;
  }
}
