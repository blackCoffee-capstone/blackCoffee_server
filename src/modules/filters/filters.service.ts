import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Location } from 'src/entities/locations.entity';
import { Theme } from 'src/entities/theme.entity';
import { FiltersResponseDto } from './dto/filters-response.dto';
import { LocationResponseDto } from './dto/location-response.dto';
import { ThemeResponseDto } from './dto/theme-response.dto';

@Injectable()
export class FiltersService {
	constructor(
		@InjectRepository(Location)
		private readonly locationsRepository: Repository<Location>,
		@InjectRepository(Theme)
		private readonly themeRepository: Repository<Theme>,
	) {}

	async getFilterList(): Promise<FiltersResponseDto<LocationResponseDto, ThemeResponseDto>> {
		try {
			const locationFilterList = await this.locationsRepository.find();
			const locationsDto = Array.from(locationFilterList).map((location) => new LocationResponseDto(location));

			const themeFilterList = await this.themeRepository.find();
			const themesDto = Array.from(themeFilterList).map((theme) => new ThemeResponseDto(theme));

			return new FiltersResponseDto({ locationsDto, themesDto });
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}
}
