import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Location } from 'src/entities/locations.entity';
import { SnsPost } from 'src/entities/sns-posts.entity';
import { Spot } from 'src/entities/spots.entity';
import { Theme } from 'src/entities/theme.entity';
import { Rank } from 'src/entities/rank.entity';
import { DetailSnsPostResponseDto } from './dto/detail-sns-post-response.dto';
import { DetailSpotRequestDto } from './dto/detail-spot-request.dto';
import { DetailSpotResponseDto } from './dto/detail-spot-response.dto';
import { LocationRequestDto } from '../filters/dto/location-request.dto';
import { SnsPostRequestDto } from './dto/sns-post-request.dto';
import { ThemeRequestDto } from '../filters/dto/theme-request.dto';
import { SpotRequestDto } from './dto/spot-request.dto';
import { SearchRequestDto } from './dto/search-request.dto';
import { SearchResponseDto } from './dto/search-response.dto';
import { SaveRequestDto } from './dto/save-request.dto';
import { FiltersService } from '../filters/filters.service';
import { RankRequestDto } from './dto/rank-request.dto';

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
		@InjectRepository(Rank)
		private readonly rankRepository: Repository<Rank>,
		private readonly filtersService: FiltersService,
	) {}

	async saveSpot(metaData: SaveRequestDto[]) {
		try {
			const spots = await this.spotsRepository.find();
			spots.forEach(async (spot) => {
				await this.spotsRepository.update(spot.id, { rank: null });
			});
			metaData.forEach(async (meta) => {
				const locationId = await this.filtersService.createLocation(new LocationRequestDto(meta));
				const themeId = await this.filtersService.createTheme(new ThemeRequestDto(meta));
				const spotId = await this.createSpot(new SpotRequestDto({ ...meta, locationId: locationId }));
				await this.createSnsPost(new SnsPostRequestDto({ ...meta, themeId: themeId, spotId: spotId }));
			});
			await this.updateSpotSns();
			return true;
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	private async updateSpotSns() {
		try {
			const spots = await this.spotsRepository
				.createQueryBuilder('spot')
				.leftJoinAndSelect('spot.snsPosts', 'snsPosts')
				.getMany();
			spots.forEach(async (spot) => {
				let likeSum = 0;
				spot.snsPosts.forEach((snsPost) => {
					likeSum += snsPost.likeNumber;
				});
				await this.spotsRepository.update(spot.id, {
					snsPostCount: spot.snsPosts.length,
					snsPostLikeNumber: likeSum,
				});
			});
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	// 임시 계산: 다시 수정 예정
	private async week() {
		const date = new Date();
		const cudate = date.getDate();
		const start = new Date(date.setDate(1));
		const day = start.getDay();
		const week = parseInt(`${(day - 1 + cudate) / 7 + 1}`);
		return week;
	}

	private async updateRank(requestRank, spotId: number) {
		try {
			await this.spotsRepository.update(spotId, { rank: requestRank.rank });

			const week = await this.week();
			const date = new Date();
			const rankRequestDto = new RankRequestDto({
				year: date.getFullYear(),
				month: date.getMonth() + 1,
				week: week,
				spotId: spotId,
				rank: requestRank.rank,
			});
			const rank = await this.rankRepository.findOne({ where: { ...rankRequestDto } });
			if (!rank) await this.rankRepository.save(rankRequestDto);
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	private async createSpot(requestSpot: SpotRequestDto) {
		const IsSpot = await this.spotsRepository.findOne({ where: { name: requestSpot.name } });
		if (IsSpot) {
			if (requestSpot.rank) await this.updateRank(requestSpot, IsSpot.id);
			return IsSpot.id;
		}
		try {
			const location = await this.locationsRepository.findOne({
				where: { id: requestSpot.locationId },
			});
			const spot = await this.spotsRepository.save({
				...requestSpot,
				location: location,
			});
			if (requestSpot.rank) await this.updateRank(requestSpot, IsSpot.id);
			return spot.id;
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	private async createSnsPost(requestSnsPost: SnsPostRequestDto) {
		const IsSnsPost = await this.snsPostRepository.findOne({ where: { photoUrl: requestSnsPost.photoUrl } });
		if (IsSnsPost) {
			if (requestSnsPost.likeNumber !== IsSnsPost.likeNumber)
				await this.snsPostRepository.update(IsSnsPost.id, {
					likeNumber: requestSnsPost.likeNumber,
				});
			return IsSnsPost.id;
		}
		try {
			const theme = await this.themeRepository.findOne({ where: { id: requestSnsPost.themeId } });
			const spot = await this.spotsRepository.findOne({ where: { id: requestSnsPost.spotId } });

			await this.snsPostRepository.save({ ...requestSnsPost, theme, spot });
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	async getSearchSpot(searchRequest: SearchRequestDto) {
		try {
			let searchSpots = this.spotsRepository
				.createQueryBuilder('spot')
				.leftJoinAndSelect('spot.location', 'location')
				.orderBy(`spot.${searchRequest.sorter}`, 'ASC');
			if (searchRequest.word) {
				searchSpots = searchSpots.where('spot.name Like :name', { name: `%${searchRequest.word}%` });
			}
			if (searchRequest.locationId) {
				const locationId = searchRequest.locationId;
				searchSpots = searchSpots.andWhere('location.id = :locationId', { locationId });
			}
			if (searchRequest.themeId) {
				searchSpots = searchSpots
					.leftJoinAndSelect('spot.snsPosts', 'snsPosts')
					.leftJoinAndSelect('snsPosts.theme', 'theme')
					.andWhere('theme.id = :id', { id: searchRequest.themeId });
			}
			const responseSpots = await searchSpots
				.limit(searchRequest.take)
				.offset((searchRequest.page - 1) * searchRequest.take)
				.getMany();

			return Array.from(responseSpots).map((post) => new SearchResponseDto(post));
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	async getDetailSpot(detailRequest: DetailSpotRequestDto, spotId: number) {
		const IsSpot = await this.spotsRepository.findOne({ where: { id: spotId } });
		if (!IsSpot) throw new NotFoundException('Spot is not found');
		try {
			let detailSnsPost = this.snsPostRepository
				.createQueryBuilder('snsPost')
				.leftJoinAndSelect('snsPost.spot', 'spot')
				.leftJoinAndSelect('snsPost.theme', 'theme')
				.where('spot.id = :spotId', { spotId });

			if (detailRequest.themeId) {
				detailSnsPost = detailSnsPost.andWhere('theme.id = :id', { id: detailRequest.themeId });
			}

			const filterSnsPosts = await detailSnsPost.limit(detailRequest.take).getMany();
			const detailSpot = await this.spotsRepository.findOne({ where: { id: spotId } });
			const detailSnsPostsDto = Array.from(filterSnsPosts).map((post) => new DetailSnsPostResponseDto(post));

			return new DetailSpotResponseDto({
				...detailSpot,
				detailSnsPost: detailSnsPostsDto,
			});
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}
}
