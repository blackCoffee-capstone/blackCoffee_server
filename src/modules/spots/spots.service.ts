import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Location } from 'src/entities/locations.entity';
import { Spot } from 'src/entities/spots.entity';
import { Theme } from 'src/entities/theme.entity';
import { SnsPost } from 'src/entities/sns-posts.entity';
import { SearchRequestDto } from './dto/search-request.dto';
import { SearchResponseDto } from './dto/search-response.dto';
import { DetailSpotResponseDto } from './dto/detail-spot-response.dto';
import { DetailSnsPostResponseDto } from './dto/detail-sns-post-response.dto';
import { LocationRequestDto } from './dto/location-request.dto';
import { SpotRequestDto } from './dto/spot-request.dto';
import { ThemeRequestDto } from './dto/theme-request.dto';
import { SnsPostRequestDto } from './dto/sns-post-request.dto';

@Injectable()
export class SpotsService {
	constructor(
		@InjectRepository(Spot)
		private readonly spotsRepository: Repository<Spot>,
		@InjectRepository(Location)
		private readonly locationsRepository: Repository<Location>,
		@InjectRepository(Theme)
		private readonly themeRepository: Repository<Theme>,
		@InjectRepository(SnsPost)
		private readonly snsPostRepository: Repository<SnsPost>,
	) {}

	async createSpot(requestSpot: SpotRequestDto) {
		const location = await this.locationsRepository.findOne({
			where: { id: requestSpot.locationId },
		});
		return await this.spotsRepository.save({
			...requestSpot,
			location: location,
		});
	}

	async createLocation(requestLocation: LocationRequestDto) {
		return await this.locationsRepository.save(requestLocation);
	}

	async createSnsPost(requestSnsPost: SnsPostRequestDto) {
		const theme = await this.themeRepository.findOne({ where: { id: requestSnsPost.themeId } });
		const spot = await this.spotsRepository.findOne({ where: { id: requestSnsPost.spotId } });

		return await this.snsPostRepository.save({ ...requestSnsPost, theme, spot });
	}

	async createTheme(requestTheme: ThemeRequestDto) {
		return await this.themeRepository.save(requestTheme);
	}

	async getSearchSpot(searchRequest: SearchRequestDto) {
		let searchSpot = await this.spotsRepository
			.createQueryBuilder('spot')
			.leftJoinAndSelect('spot.location', 'location')
			.orderBy(`spot.${searchRequest.sorter}`, 'ASC')
			.where('spot.name Like :name', { name: `%${searchRequest.word}%` });

		if (searchRequest.locationId) {
			const locationId = searchRequest.locationId;
			searchSpot = searchSpot.andWhere('location.id = :locationId', { locationId });
		}
		if (searchRequest.themeId) {
			searchSpot = searchSpot
				.leftJoinAndSelect('spot.snsPosts', 'snsPosts')
				.leftJoinAndSelect('snsPosts.theme', 'theme')
				.andWhere('theme.id = :id', { id: searchRequest.themeId });
		}
		const responseSpots = await searchSpot
			.limit(searchRequest.take)
			.offset((searchRequest.page - 1) * searchRequest.take)
			.getMany();

		return Array.from(responseSpots).map((post) => new SearchResponseDto(post));
	}

	async getDetailSpot(searchRequest: SearchRequestDto, spotId: number) {
		let detailSnsPost = await this.snsPostRepository
			.createQueryBuilder('snsPost')
			.leftJoinAndSelect('snsPost.spot', 'spot')
			.leftJoinAndSelect('snsPost.theme', 'theme')
			.where('spot.id = :spotId', { spotId });

		if (searchRequest.themeId) {
			detailSnsPost = detailSnsPost.andWhere('theme.id = :id', { id: searchRequest.themeId });
		}

		const filterSnsPosts = await detailSnsPost.getMany();
		const detailSpot = await this.spotsRepository.findOne({ where: { id: spotId } });
		const detailSnsPostsDto = Array.from(filterSnsPosts).map((post) => new DetailSnsPostResponseDto(post));

		return new DetailSpotResponseDto({
			...detailSpot,
			detailSnsPost: detailSnsPostsDto,
		});
	}
}
