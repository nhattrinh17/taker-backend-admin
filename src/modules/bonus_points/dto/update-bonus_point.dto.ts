import { PartialType } from '@nestjs/mapped-types';
import { CreateBonusPointDto } from './create-bonus_point.dto';

export class UpdateBonusPointDto extends PartialType(CreateBonusPointDto) {}
