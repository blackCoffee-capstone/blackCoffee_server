import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fastcsv from 'fast-csv';
import * as fs from 'fs';
import * as path from 'path';
import { Repository } from 'typeorm';

import { Location } from 'src/entities/locations.entity';
import { Rank } from 'src/entities/rank.entity';
import { SnsPost } from 'src/entities/sns-posts.entity';
import { Spot } from 'src/entities/spots.entity';
import { Theme } from 'src/entities/theme.entity';
import { RanksUpdateRequestDto } from '../ranks/dto/ranks-update-request.dto';
import { DetailSnsPostResponseDto } from './dto/detail-sns-post-response.dto';
import { DetailSpotRequestDto } from './dto/detail-spot-request.dto';
import { DetailSpotResponseDto } from './dto/detail-spot-response.dto';
import { RankRequestDto } from './dto/rank-request.dto';
import { SaveRequestDto } from './dto/save-request.dto';
import { SearchRequestDto } from './dto/search-request.dto';
import { SearchResponseDto } from './dto/search-response.dto';
import { SnsPostRequestDto } from './dto/sns-post-request.dto';
import { SpotRequestDto } from './dto/spot-request.dto';
import { RanksService } from '../ranks/ranks.service';

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
		private readonly ranksService: RanksService,
	) {}

	async createSpots(file: Express.Multer.File) {
		if (!file) throw new BadRequestException('File is not exist');
		const fileName: string = file.filename;
		const snsPosts = await this.readCsv(path.resolve('src/database/datas', fileName));
		//TODO: ml로 전달
		const metaData: SaveRequestDto[] = [];
		// return this.saveSpot(metaData);
		return snsPosts;
	}

	private async readCsv(filePath: string) {
		return new Promise((resolve, reject) => {
			const csvData = [];
			const csvStream = fs.createReadStream(filePath);
			const csvParser = fastcsv.parse({ headers: true });

			csvStream
				.pipe(csvParser)
				.on('error', (err) => {
					throw new InternalServerErrorException(err);
				})
				.on('data', (row) => {
					const place = row.place;
					const latitude = Number(row.latitude);
					const longitude = Number(row.longitude);
					const link = row.link;
					const datetime = new Date(row.datetime);
					const like = row.like;
					const text = row.text;
					csvData.push({
						place,
						latitude,
						longitude,
						link,
						datetime,
						like,
						text,
					});
				})
				.on('end', () => {
					resolve(csvData);
				});
		});
	}

	private async saveSpot(metaData: SaveRequestDto[]) {
		try {
			await this.spotsRepository.update({}, { rank: null });
			await this.noDuplicateSpot(metaData);
			await this.noDuplicateSnsPost(metaData);

			return true;
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	private async noDuplicateSpot(metaData: SaveRequestDto[]) {
		try {
			const addSpots = Array.from(metaData).map((meta) => [
				meta.name,
				meta.latitude,
				meta.longitude,
				meta.rank,
				meta.metroName,
				meta.localName,
			]);
			const noDupSpots = [...new Set(addSpots.join('|').split('|'))].map((s) => s.split(','));
			for (const spot of noDupSpots) {
				if (spot[5] === '') spot[5] = null;
				const location = await this.locationsRepository
					.createQueryBuilder('location')
					.where('metro_name = :metro', { metro: spot[4] })
					.andWhere('local_name = :local', { local: spot[5] })
					.getOne();
				if (!location) continue;
				await this.createSpot(
					new SpotRequestDto({
						locationId: location.id,
						name: spot[0],
						latitude: +spot[1],
						longitude: +spot[2],
						rank: +spot[3],
					}),
					location,
				);
			}
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	private async noDuplicateSnsPost(metaData: SaveRequestDto[]) {
		try {
			const addSnsPosts = Array.from(metaData).map((meta) => [
				meta.date,
				meta.likeNumber,
				meta.photoUrl,
				meta.content,
				meta.themeName,
				meta.name,
			]);
			const noDupSnsPosts = [...new Set(addSnsPosts.join('|').split('|'))].map((s) => s.split(','));
			const changeSpots = [];
			for (const sns of noDupSnsPosts) {
				const spot = await this.spotsRepository
					.createQueryBuilder('spot')
					.where('name = :name', { name: sns[5] })
					.getOne();
				const theme = await this.themeRepository
					.createQueryBuilder('theme')
					.where('name = :name', { name: sns[4] })
					.getOne();
				if (!theme || !spot) continue;
				changeSpots.push(spot.id);
				await this.createSnsPost(
					new SnsPostRequestDto({
						themeId: theme.id,
						spotId: spot.id,
						date: sns[0],
						likeNumber: +sns[1],
						photoUrl: sns[2],
						content: sns[3],
					}),
					spot,
					theme,
				);
			}
			await this.updateSpotSns(changeSpots);
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	private async updateSpotSns(changeSpots) {
		try {
			const noDupSpots = [...new Set(changeSpots)];
			if (noDupSpots.length) {
				const updateSpots = await this.snsPostRepository
					.createQueryBuilder('snsPost')
					.select('snsPost.spotId', 'spotId')
					.addSelect('SUM(snsPost.likeNumber)', 'likeSum')
					.addSelect('COUNT (*)', 'snsPost')
					.where('snsPost.spotId IN (:...spotId)', { spotId: noDupSpots })
					.groupBy('snsPost.spotId')
					.getRawMany();

				for (const spot of updateSpots) {
					await this.spotsRepository.update(spot.spotId, {
						snsPostCount: spot.snsPost,
						snsPostLikeNumber: spot.likeSum,
					});
				}
			}
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	private async createSpot(requestSpot: SpotRequestDto, location: Location) {
		const IsSpot = await this.spotsRepository.findOne({ where: { name: requestSpot.name } });
		try {
			if (!IsSpot) {
				if (requestSpot.rank === 0) requestSpot.rank = null;
				const spot = await this.spotsRepository.save({
					...requestSpot,
					location: location,
				});
				if (requestSpot.rank)
					await this.ranksService.updateRank(
						new RanksUpdateRequestDto({ spotId: spot.id, rank: requestSpot.rank }),
					);
			} else {
				await this.ranksService.updateRank(
					new RanksUpdateRequestDto({ spotId: IsSpot.id, rank: requestSpot.rank }),
				);
			}
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	private async createSnsPost(requestSnsPost: SnsPostRequestDto, spot: Spot, theme: Theme) {
		const IsSnsPost = await this.snsPostRepository.findOne({ where: { photoUrl: requestSnsPost.photoUrl } });
		try {
			if (IsSnsPost) {
				if (requestSnsPost.likeNumber !== IsSnsPost.likeNumber)
					await this.snsPostRepository.update(IsSnsPost.id, {
						likeNumber: requestSnsPost.likeNumber,
					});
			} else {
				await this.snsPostRepository.save({ ...requestSnsPost, theme, spot });
			}
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
			const detailSnsPostsDto = Array.from(filterSnsPosts).map((post) => new DetailSnsPostResponseDto(post));

			return new DetailSpotResponseDto({
				...IsSpot,
				detailSnsPost: detailSnsPostsDto,
			});
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}
}
