import { IntersectionType, PickType } from '@nestjs/swagger';

import { SearchRequestDto } from './search-request.dto';
import { SearchFilterRequestDto } from './search-filter-request.dto';

export class DetailSpotRequestDto extends IntersectionType(
	PickType(SearchRequestDto, ['take'] as const),
	PickType(SearchFilterRequestDto, ['themeIds'] as const),
) {}
