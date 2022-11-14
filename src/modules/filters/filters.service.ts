import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Location } from 'src/entities/locations.entity';
import { Theme } from 'src/entities/theme.entity';
import { LocationRequestDto } from './dto/location-request.dto';
import { LocationResponseDto } from './dto/location-response.dto';
import { ThemeRequestDto } from './dto/theme-request.dto';
import { ThemeResponseDto } from './dto/theme-response.dto';

@Injectable()
export class FiltersService {
	constructor(
		@InjectRepository(Location)
		private readonly locationsRepository: Repository<Location>,
		@InjectRepository(Theme)
		private readonly themeRepository: Repository<Theme>,
	) {}

	async createLocation(requestLocation: LocationRequestDto) {
		return await this.locationsRepository.save(requestLocation);
	}

	async createTheme(requestTheme: ThemeRequestDto) {
		return await this.themeRepository.save(requestTheme);
	}

	async getFilterList() {
		const themeFilterList = await this.themeRepository.find();
		const themeDto = Array.from(themeFilterList).map((theme) => new ThemeResponseDto(theme));

		const locationFilterList = await this.locationsRepository.find();
		const locationDto = Array.from(locationFilterList).map((location) => new LocationResponseDto(location));

		return [themeDto, locationDto];
	}
}
