import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FiltersService } from './filters.service';
import { ApiDocs } from './filters.docs';

@Controller('filters')
@ApiTags('filters - 필터링 정보')
export class FiltersController {
	constructor(private readonly filtersService: FiltersService) {}

	@Get()
	@ApiDocs.filterList('필터링 목록 반환')
	async filterList() {
		return await this.filtersService.getFilterList();
	}
}
