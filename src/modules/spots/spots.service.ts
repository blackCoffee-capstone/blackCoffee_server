import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Spot } from 'src/entities/spots.entity';
import { LocalLocation } from 'src/entities/local-locations.entity';
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
import { LocalLocationResponseDto } from './dto/local-location-response.dto';
import { LocalLocationRequestDto } from './dto/local-location-request.dto';
import { MetroLocation } from 'src/entities/metro-locations.entity';
import { MetroLocationRequestDto } from './dto/metro-location-request.dto';
import { MetroLocationResponseDto } from './dto/metro-location-response.dto';

@Injectable()
export class SpotsService {
	constructor(
		@InjectRepository(Spot)
		private readonly spotsRepository: Repository<Spot>,
		@InjectRepository(MetroLocation)
		private readonly MetroLocationsRepository: Repository<MetroLocation>,
		@InjectRepository(LocalLocation)
		private readonly localLocationsRepository: Repository<LocalLocation>,
		@InjectRepository(Theme)
		private readonly themeRepository: Repository<Theme>,
		@InjectRepository(SnsPost)
		private readonly snsPostRepository: Repository<SnsPost>,
	) {}

	async createSpot(requestSpot: SpotRequestDto) {
		const localLocation = await this.localLocationsRepository.findOne({
			where: { id: requestSpot.localLocationId },
		});
		const saveSpot = await this.spotsRepository.save({
			...requestSpot,
			localLocation: localLocation,
		});
		const metroLocaton = await this.MetroLocationsRepository.findOne({
			where: { id: localLocation.metroLocation.id },
		});
		const spotLocalLocation = new LocalLocationResponseDto({
			id: localLocation.id,
			metroLocation: metroLocaton,
			depth: localLocation.depth,
			name: localLocation.name,
		});

		return new SpotResponseDto({
			...saveSpot,
			localLocation: spotLocalLocation,
		});
	}

	async createMetroLocation(requestMetroLocation: MetroLocationRequestDto) {
		const MetroLocation = await this.MetroLocationsRepository.save(requestMetroLocation);
		return new MetroLocationResponseDto(MetroLocation);
	}

	async getAllMetroLocation() {
		return await this.MetroLocationsRepository.find();
	}

	async createLocalLocation(requestLocalLocation: LocalLocationRequestDto) {
		const localLocation = await this.localLocationsRepository.save({
			...requestLocalLocation,
			metroLocationId: requestLocalLocation.metroLocationId,
		});
		return new LocalLocationResponseDto(localLocation);
	}

	async getAllLocalLocation() {
		return await this.localLocationsRepository.find();
	}

	async createSnsPost(requestSnsPost: SnsPostRequestDto) {
		let theme = await this.themeRepository.findOne({ where: { id: requestSnsPost.themeId } });
		let spot = await this.spotsRepository.findOne({ where: { id: requestSnsPost.spotId } });
		let localLocation = await this.localLocationsRepository.findOne({ where: { id: spot.id } });

		const saveSnsSpot = await this.snsPostRepository.save({ ...requestSnsPost, theme, spot });

		const snsPostTheme = new ThemeResponseDto({ ...theme });
		const snsPostSpot = new SpotResponseDto({ ...spot, localLocation });
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
			let spotDto = new SearchResponseDto({ id: responseSpot.at(i).id, spotName: responseSpot.at(i).spotName });
			responseSpotDto.push(spotDto);
		}
		return responseSpotDto;
	}

	async getSearchThemeSpot(searchRequest: SearchRequestDto, responseSpot) {
		let addThemeSpot = [];
		if (searchRequest.theme) {
			for (let i = 1; i < responseSpot.length + 1; i++) {
				let themeSpot = await this.getDetailSpot(searchRequest, i);
				if (themeSpot.detailSnsPost.length) addThemeSpot.push(themeSpot);
			}
			return await this.returnResponseSpotDto(addThemeSpot);
		}
		return await this.returnResponseSpotDto(responseSpot);
	}

	async getSearchSpot(searchRequest: SearchRequestDto) {
		const responseSpot = await this.spotsRepository
			.createQueryBuilder('spot')
			.leftJoinAndSelect('spot.localLocation', 'localLocation')
			.orderBy(`spot.${searchRequest.sorter}`, 'ASC')
			.select(['spot.id', 'spot.spotName', 'localLocation.id', 'localLocation.name'])
			.where('spot.spotName Like :spotName', { spotName: `%${searchRequest.word}%` })
			.andWhere('localLocation.id = :name', { id: searchRequest.localLocationId })
			.limit(searchRequest.take)
			.offset((searchRequest.page - 1) * searchRequest.take)
			.getMany();

		return this.getSearchThemeSpot(searchRequest, responseSpot);
	}

	async getDetailSnsPost(theme: number, detailSpot: Spot) {
		const detailSnsPost = detailSpot.snsPosts;

		let finalDetailSns = [];
		for (let i = 0; i < detailSnsPost.length; i++) {
			let snsPostForTheme = await this.snsPostRepository
				.createQueryBuilder('snsPost')
				.leftJoinAndSelect('snsPost.theme', 'theme')
				.select(['theme.id', 'theme.name', 'snsPost.id'])
				.where('snsPost.id = :id', { id: detailSnsPost.at(+i).id })
				.andWhere('theme.name = :id', { id: theme })
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

	async getDetailSpot(searchRequest: SearchRequestDto, spotId: number) {
		const detailSpot = await this.spotsRepository.findOne({ where: { id: spotId } });
		const detailSnsPost = await this.getDetailSnsPost(searchRequest.theme, detailSpot);

		const returnDetailSpot = new DetailSpotResponseDto({
			...detailSpot,
			detailSnsPost: detailSnsPost,
			favorability: detailSpot.snsPostLikeNumber * detailSpot.snsPostCount, // 수정 예정
		});

		return returnDetailSpot;
	}
}
