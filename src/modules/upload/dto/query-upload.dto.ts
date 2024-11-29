import { IsString } from 'class-validator';

export class QueryUploadGetUrl {
  @IsString()
  fileName: string;
}
