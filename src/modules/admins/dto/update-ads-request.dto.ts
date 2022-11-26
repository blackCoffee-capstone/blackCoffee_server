import { PartialType } from '@nestjs/swagger';
import { AdsRegisterRequestDto } from './ads-register-request.dto';

export class UpdateAdsRequestDto extends PartialType(AdsRegisterRequestDto) {}
