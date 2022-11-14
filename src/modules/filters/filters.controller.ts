import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { LocationRequestDto } from './dto/location-request.dto';
import { FiltersService } from './filters.service';
import { ThemeRequestDto } from './dto/theme-request.dto';
import { ApiDocs } from './filters.docs';

@Controller('filters')
@ApiTags('filters - 필터링 정보')
export class FiltersController {
	constructor(private readonly filtersService: FiltersService) {}

	// Test
	@Post('/locations')
	@ApiDocs.createLocation('위치 정보 생성')
	async createLocation(@Body() location: LocationRequestDto) {
		return await this.filtersService.createLocation(location);
	}

	// Test
	@Post('/themes')
	@ApiDocs.createTheme('테마 정보 생성')
	async createTheme(@Body() theme: ThemeRequestDto) {
		return await this.filtersService.createTheme(theme);
	}

	@Get()
	@ApiDocs.filterList('필터링 목록 반환')
	async filterList() {
		return await this.filtersService.getFilterList();
	}
}
