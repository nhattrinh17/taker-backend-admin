import { IsOptional, IsString } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  userName: string;

  @IsString()
  password: string;
}

export class LoginDto {
  @IsString()
  userName: string;

  @IsString()
  password: string;
}

export class updateInfoAdminDto {
  @IsOptional()
  @IsString()
  fcmToken: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  passwordOld: string;
}
