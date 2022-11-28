import { PartialType } from '@nestjs/swagger';

import { AdFormsStatusRequestDto } from './ad-forms-status-request.dto';

export class AdFormsFilterRequestDto extends PartialType(AdFormsStatusRequestDto) {}
