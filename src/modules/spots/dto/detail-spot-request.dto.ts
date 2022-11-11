import { PickType } from '@nestjs/swagger';

import { SearchRequestDto } from './search-request.dto';

export class DetailSpotRequestDto extends PickType(SearchRequestDto, ['themeId', 'take'] as const) {}
