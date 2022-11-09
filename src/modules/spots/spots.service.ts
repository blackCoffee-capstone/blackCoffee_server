import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Spot } from 'src/entities/spots.entity';
import { Location } from 'src/entities/locations.entity';
import { SpotRequestDto } from './dto/spot-request.dto';
import { SpotResponseDto } from './dto/spot-response.dto';
import { SearchRequestDto } from './dto/search-request.dto';
import { Theme } from 'src/entities/theme.entity';
import { SnsPost } from 'src/entities/sns-posts.entity';
import { ThemeRequestDto } from './dto/theme-request.dto';
import { ThemeResponseDto } from './dto/theme-response.dto';
import { SnsPostRequestDto } from './dto/sns-post-request.dto';
import { SnsPostResponseDto } from './dto/sns-post-response.dto';
import { DetailSnsPostResponseDto } from './dto/detail-sns-post-response.dto';
import { DetailSpotResponseDto } from './dto/detail-spot-response.dto';
import { SearchResponseDto } from './dto/search-response.dto';
import { LocationResponseDto } from './dto/location-response.dto';
import { LocationRequestDto } from './dto/location-request.dto';

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

	async createSpot(requestSpot: SpotRequestDto): Promise<SpotResponseDto> {
		const location = await this.locationsRepository.findOne({
			where: { id: requestSpot.locationId },
		});
		const saveSpot = await this.spotsRepository.save({
			...requestSpot,
			location: location,
		});
		const spotLocation = new LocationResponseDto(location);

		return new SpotResponseDto({
			...saveSpot,
			location: spotLocation,
		});
	}

	async createLocation(requestLocation: LocationRequestDto) {
		const location = await this.locationsRepository.save(requestLocation);
		return new LocationResponseDto(location);
	}

	async getAllLocation() {
		return await this.locationsRepository.find();
	}

	async createSnsPost(requestSnsPost: SnsPostRequestDto): Promise<SnsPostResponseDto> {
		const theme = await this.themeRepository.findOne({ where: { id: requestSnsPost.themeId } });
		const spot = await this.spotsRepository.findOne({ where: { id: requestSnsPost.spotId } });
		const location = await this.locationsRepository.findOne({ where: { id: spot.id } });

		const saveSnsSpot = await this.snsPostRepository.save({ ...requestSnsPost, theme, spot });

		const snsPostTheme = new ThemeResponseDto({ ...theme });
		const snsPostSpot = new SpotResponseDto({ ...spot, location });
		return new SnsPostResponseDto({ ...saveSnsSpot, theme: snsPostTheme, spot: snsPostSpot });
	}

	async getAllSnsPost() {
		return await this.snsPostRepository.find();
	}

	async createTheme(requestTheme: ThemeRequestDto): Promise<ThemeResponseDto> {
		const theme = await this.themeRepository.save(requestTheme);
		return new ThemeResponseDto(theme);
	}

	async getAllTheme() {
		return await this.themeRepository.find();
	}

	async returnResponseSpotDto(responseSpot) {
		const responseSpotDto = [];

		for (let i = 0; i < responseSpot.length; i++) {
			const spotDto = new SearchResponseDto({ id: responseSpot.at(i).id, spotName: responseSpot.at(i).spotName });
			responseSpotDto.push(spotDto);
		}
		return responseSpotDto;
	}

	async getSearchSpot(searchRequest: SearchRequestDto) {
		let searchSpot = await this.spotsRepository
			.createQueryBuilder('spot')
			.leftJoinAndSelect('spot.location', 'location')
			.orderBy(`spot.${searchRequest.sorter}`, 'ASC')
			.where('spot.spotName Like :spotName', { spotName: `%${searchRequest.word}%` });

		const locationId = searchRequest.locationId;
		if (searchRequest.locationId) {
			searchSpot = searchSpot.andWhere('location.id = :locationId', { locationId });
		}
		if (searchRequest.themeId) {
			searchSpot = searchSpot
				.leftJoinAndSelect('spot.snsPosts', 'snsPosts')
				.leftJoinAndSelect('snsPosts.theme', 'theme')
				.andWhere('theme.id=:id', { id: searchRequest.themeId });
		}
		const responseSpot = await searchSpot
			.limit(searchRequest.take)
			.offset((searchRequest.page - 1) * searchRequest.take)
			.getMany();
		return await this.returnResponseSpotDto(responseSpot);
	}

	async getDetailSnsPost(filterSnsPost) {
		const responseSnsPostDto = [];

		for (let i = 0; i < filterSnsPost.length; i++) {
			const spotDto = new DetailSnsPostResponseDto({ ...filterSnsPost.at(i) });
			responseSnsPostDto.push(spotDto);
		}
		return responseSnsPostDto;
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

		const filterSnsPost = await detailSnsPost.getMany();
		const detailSpot = await this.spotsRepository.findOne({ where: { id: spotId } });
		const detailSnsPostDto = await this.getDetailSnsPost(filterSnsPost);

		return new DetailSpotResponseDto({
			...detailSpot,
			detailSnsPost: detailSnsPostDto,
			favorability: detailSpot.snsPostLikeNumber * detailSpot.snsPostCount, // 수정 예정
		});
	}
}
