import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Spot } from 'src/entities/spots.entity';
import { Location } from 'src/entities/locations.entity';
import { SpotRequestDto } from './dto/spot-request.dto';
import { LocationRequestDto } from './dto/location-request.dto';
import { SpotResponseDto } from './dto/spot-response.dto';
import { LocationResponseDto } from './dto/location-response.dto';
import { SearchRequestDto } from './dto/search-request.dto';
import { Theme } from 'src/entities/theme.entity';
import { SnsPost } from 'src/entities/sns-posts.entity';
import { ThemeRequestDto } from './dto/theme-request.dto';
import { ThemeResponseDto } from './dto/theme-response.dto';
import { SnsPostRequestDto } from './dto/sns-post-request.dto';
import { SnsPostResponseDto } from './dto/sns-post-response.dto';
import { MetroOnlyFirstType } from 'src/types/metroLocation.types';
import { DetailSnsPostResponseDto } from './dto/detail-sns-post-response.dto';
import { DetailSpotResponseDto } from './dto/detail-spot-response.dto';
import { SearchResponseDto } from './dto/search-response.dto';

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
		let location = await this.locationsRepository.findOne({ where: { id: requestSpot.locationId } });
		const saveSpot = await this.spotsRepository.save({
			...requestSpot,
			location: location,
		});
		const spotLocation = new LocationResponseDto({
			id: location.id,
			name: location.name,
		});

		return new SpotResponseDto({
			...saveSpot,
			location: spotLocation,
		});
	}

	async createLocation(requestLocaiton: LocationRequestDto) {
		const location = await this.locationsRepository.save(requestLocaiton);
		return new LocationResponseDto(location);
	}

	async getAllLocation() {
		return await this.locationsRepository.find();
	}

	async createSnsPost(requestSnsPost: SnsPostRequestDto) {
		let theme = await this.themeRepository.findOne({ where: { id: requestSnsPost.themeId } });
		let spot = await this.spotsRepository.findOne({ where: { id: requestSnsPost.spotId } });
		let location = await this.locationsRepository.findOne({ where: { id: spot.id } });

		const saveSnsSpot = await this.snsPostRepository.save({ ...requestSnsPost, theme, spot });

		const snsPostTheme = new ThemeResponseDto({ ...theme });
		const snsPostSpot = new SpotResponseDto({ ...spot, location });
		return new SnsPostResponseDto({ ...saveSnsSpot, theme: snsPostTheme, spot: snsPostSpot });
	}

	async getAllSnsPost() {
		return await this.snsPostRepository.find();
	}

	async createTheme(requestTheme: ThemeRequestDto) {
		const theme = await this.themeRepository.save(requestTheme);
		return new ThemeResponseDto(theme);
	}

	async getAllTheme() {
		return await this.themeRepository.find();
	}

	async returnResponseSpotDto(responseSpot) {
		let responseSpotDto = [];
		for (let i = 0; i < responseSpot.length; i++) {
			let spotDto = new SearchResponseDto({ spotName: responseSpot.at(i).spotName });
			responseSpotDto.push(spotDto);
		}
		return responseSpotDto;
	}

	async getFilterSpot(searchRequest: SearchRequestDto, fullLocation: string) {
		const responseSpot = await this.spotsRepository
			.createQueryBuilder('spot')
			.leftJoinAndSelect('spot.location', 'location')
			.orderBy(`spot.${searchRequest.sorter}`, 'ASC')
			.select(['spot.id', 'spot.spotName', 'location.id', 'location.name'])
			.where('spot.spotName Like :spotName', { spotName: `%${searchRequest.word}%` })
			.andWhere('location.name Like :name', { name: `%${fullLocation}%` })
			.limit(searchRequest.take)
			.offset((searchRequest.page - 1) * searchRequest.take)
			.getMany();

		let addThemeSpot = [];
		if (searchRequest.theme) {
			for (let i = 1; i < responseSpot.length + 1; i++) {
				let themeSpot = await this.requestDetailSpot(searchRequest, i);
				if (themeSpot.detailSnsPost.length) addThemeSpot.push(themeSpot);
			}
			return await this.returnResponseSpotDto(addThemeSpot);
		}
		return await this.returnResponseSpotDto(responseSpot);
	}

	async getSearchSpot(searchRequest: SearchRequestDto) {
		if (searchRequest.metroLocation in MetroOnlyFirstType || !searchRequest.metroLocation) {
			return this.getFilterSpot(searchRequest, searchRequest.metroLocation);
		} else {
			const fullLocation = searchRequest.metroLocation.concat(' ', searchRequest.localLocation);
			return this.getFilterSpot(searchRequest, fullLocation);
		}
	}

	async getDetailSnsPost(theme: string, detailSpot: Spot) {
		const detailSnsPost = detailSpot.snsPosts;

		let finalDetailSns = [];
		for (let i = 0; i < detailSnsPost.length; i++) {
			let snsPostForTheme = await this.snsPostRepository
				.createQueryBuilder('snsPost')
				.leftJoinAndSelect('snsPost.theme', 'theme')
				.select(['theme.name', 'snsPost.id'])
				.where('snsPost.id = :id', { id: detailSnsPost.at(+i).id })
				.andWhere('theme.name Like :name', { name: `%${theme}%` })
				.getOne();
			if (snsPostForTheme) {
				let detailSnsDto = new DetailSnsPostResponseDto({
					...detailSnsPost.at(+i),
					theme: snsPostForTheme,
				});
				finalDetailSns.push(detailSnsDto);
			}
		}
		return finalDetailSns;
	}

	async requestDetailSpot(searchRequest: SearchRequestDto, spotId: number) {
		const detailSpot = await this.spotsRepository.findOne({ where: { id: spotId } });
		const detailSnsPost = await this.getDetailSnsPost(searchRequest.theme, detailSpot);

		const returnDetailSpot = new DetailSpotResponseDto({
			...detailSpot,
			detailSnsPost: detailSnsPost,
			favorability: detailSpot.snsPostLikeNumber * detailSpot.snsPostCount,
		});

		return returnDetailSpot;
	}
}
