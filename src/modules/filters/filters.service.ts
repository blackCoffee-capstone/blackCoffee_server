import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Location } from 'src/entities/locations.entity';
import { Theme } from 'src/entities/theme.entity';
import { FiltersResponseDto } from './dto/filters-response.dto';
import { ThemeResponseDto } from './dto/theme-response.dto';
import { LocationFiltersResponseDto } from './dto/location-filters-response.dto';

@Injectable()
export class FiltersService {
	constructor(
		@InjectRepository(Location)
		private readonly locationsRepository: Repository<Location>,
		@InjectRepository(Theme)
		private readonly themeRepository: Repository<Theme>,
	) {}

	async getFilterList() {
		try {
			const locationFilterList = await this.locationsRepository.find();
			const metroNames = await this.locationsRepository
				.createQueryBuilder('location')
				.select('location.metroName, location.id')
				.where('location.localName is null')
				.getRawMany();
			const allLocationsDto = [];
			for (const metro of metroNames) {
				const localsArray = locationFilterList.filter((location) => location.metroName === metro.metro_name);
				const locals = Array.prototype.flatMap.call(
					localsArray.filter((local) => local.localName !== null),
					({ id, localName }) => ({
						id: id,
						level: 2,
						localName: localName,
					}),
				);
				allLocationsDto.push(
					new LocationFiltersResponseDto({
						id: metro.id,
						level: 1,
						metroName: metro.metro_name,
						localNames: locals,
					}),
				);
			}
			const themeFilterList = await this.themeRepository.find();
			const themesDto = Array.from(themeFilterList).map((theme) => new ThemeResponseDto(theme));

			return new FiltersResponseDto({ locationsDto: allLocationsDto, themesDto: themesDto });
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}
}
