import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fastcsv from 'fast-csv';
import * as fs from 'fs';
import * as path from 'path';
import { Repository } from 'typeorm';

import { ConfigService } from '@nestjs/config';
import { SshConfig } from 'src/config/config.constant';
import { Location } from 'src/entities/locations.entity';
import { SnsPost } from 'src/entities/sns-posts.entity';
import { Spot } from 'src/entities/spots.entity';
import { Theme } from 'src/entities/theme.entity';
import { LocationResponseDto } from '../filters/dto/location-response.dto';
import { RanksUpdateRequestDto } from '../ranks/dto/ranks-update-request.dto';
import { RanksService } from '../ranks/ranks.service';
import { DetailSnsPostResponseDto } from './dto/detail-sns-post-response.dto';
import { DetailSpotRequestDto } from './dto/detail-spot-request.dto';
import { DetailSpotResponseDto } from './dto/detail-spot-response.dto';
import { SaveRequestDto } from './dto/save-request.dto';
import { SearchRequestDto } from './dto/search-request.dto';
import { SearchResponseDto } from './dto/search-response.dto';
import { SearchPageResponseDto } from './dto/search-page-response.dto';
import { SearchFilterRequestDto } from './dto/search-filter-request.dto';
import { SnsPostRequestDto } from './dto/sns-post-request.dto';
import { SpotRequestDto } from './dto/spot-request.dto';

const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

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
		private readonly configService: ConfigService,
	) {}
	#sshConfig = this.configService.get<SshConfig>('sshConfig');

	async createSpots(file: Express.Multer.File) {
		if (!file) throw new BadRequestException('File is not exist');
		const fileName: string = file.filename;
		const snsPosts = await this.readCsv(path.resolve('src/database/datas', fileName));
		const localResultPath = './src/modules/spots/results/result.json';

		await ssh
			.connect({
				host: this.#sshConfig.host,
				username: this.#sshConfig.userName,
				port: this.#sshConfig.port,
				password: this.#sshConfig.password,
			})
			.then(async function () {
				await ssh
					.putFile(
						`./src/database/datas/${fileName}`,
						`/home/iknow/Desktop/blackcoffee/postClassifier/testingData/${fileName}`,
					)
					.then(async function () {
						await ssh
							.execCommand(
								`bash "/home/iknow/Desktop/blackcoffee/postClassifier/run_classify.sh" "/home/iknow/Desktop/blackcoffee/postClassifier/testingData/${fileName}" "/home/iknow/Desktop/blackcoffee/postClassifier/spotresult4.json"`,
								{},
							)
							.then(async function () {
								await ssh
									.getFile(
										localResultPath,
										'/home/iknow/Desktop/blackcoffee/postClassifier/spotresult4.json',
									)
									.then(async function () {
										await ssh.dispose();
									});
							});
					});
			});
		const spotsFile = fs.readFileSync(localResultPath);
		const spots = JSON.parse(spotsFile.toString());
		const metaData: SaveRequestDto[] = spots.map((spot) => new SaveRequestDto(spot));
		return await this.saveSpot(metaData);
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
			const addSpots = metaData.filter((character, idx, arr) => {
				return (
					arr.findIndex(
						(item) =>
							item.name === character.name &&
							item.metroName === character.metroName &&
							item.localName === character.localName &&
							item.latitude === character.latitude &&
							item.longitude === character.longitude &&
							item.rank === character.rank,
					) === idx
				);
			});

			for (const spot of addSpots) {
				if (!spot.rank) spot.rank = null;
				let location = await this.locationsRepository
					.createQueryBuilder('location')
					.where('metro_name = :metro', { metro: spot.metroName });

				if (spot.localName === null) location = await location.andWhere('location.local_name is null');
				else location = await location.andWhere('local_name = :local', { local: spot.localName });
				const oneLocation = await location.getOne();

				if (!oneLocation) continue;
				await this.createSpot(
					new SpotRequestDto({
						locationId: oneLocation.id,
						name: spot.name,
						latitude: spot.latitude,
						longitude: spot.longitude,
						rank: spot.rank,
					}),
					oneLocation,
				);
			}
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	private async noDuplicateSnsPost(metaData: SaveRequestDto[]) {
		try {
			const addSnsPosts = metaData.filter((character, idx, arr) => {
				return (
					arr.findIndex(
						(item) =>
							item.date === character.date &&
							item.likeNumber === character.likeNumber &&
							item.photoUrl === character.photoUrl &&
							item.content === character.content &&
							item.themeName === character.themeName &&
							item.name === character.name,
					) === idx
				);
			});
			const changeSpots = [];
			for (const sns of addSnsPosts) {
				const spot = await this.spotsRepository
					.createQueryBuilder('spot')
					.where('name = :name', { name: sns.name })
					.getOne();
				const theme = await this.themeRepository
					.createQueryBuilder('theme')
					.where('name = :name', { name: sns.themeName })
					.getOne();
				if (!theme || !spot) continue;
				changeSpots.push(spot.id);
				await this.createSnsPost(
					new SnsPostRequestDto({
						themeId: theme.id,
						spotId: spot.id,
						date: sns.date,
						likeNumber: sns.likeNumber,
						photoUrl: sns.photoUrl,
						content: sns.content,
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

	async getSearchSpot(searchRequest: SearchRequestDto, searchFilter: SearchFilterRequestDto) {
		try {
			let searchSpots = this.spotsRepository
				.createQueryBuilder('spot')
				.leftJoinAndSelect('spot.location', 'location')
				.orderBy(`spot.${searchRequest.sorter}`, 'ASC');
			if (searchRequest.word) {
				searchSpots = searchSpots.where('spot.name Like :name', { name: `%${searchRequest.word}%` });
			}
			if (searchFilter.locationIds) {
				const locationIds = searchFilter.locationIds;
				searchSpots = searchSpots.andWhere('location.id IN (:...locationIds)', { locationIds: locationIds });
			}
			if (searchFilter.themeIds) {
				searchSpots = searchSpots
					.leftJoinAndSelect('spot.snsPosts', 'snsPosts')
					.leftJoinAndSelect('snsPosts.theme', 'theme')
					.andWhere('theme.id IN (:...themeIds)', { themeIds: searchFilter.themeIds });
			}
			const totalPageSpots = await searchSpots.getMany();
			const responseSpots = await searchSpots
				.limit(searchRequest.take)
				.offset((searchRequest.page - 1) * searchRequest.take)
				.getMany();

			const totalPage = Math.ceil(totalPageSpots.length / searchRequest.take);
			const spots = Array.from(responseSpots).map(
				(spot) =>
					new SearchResponseDto({
						...spot,
						location: new LocationResponseDto({
							id: spot.location.id,
							metroName: spot.location.metroName,
							localName: spot.location.localName,
						}),
					}),
			);
			return new SearchPageResponseDto({ totalPage: totalPage, spots: spots });
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

			if (detailRequest.themeIds) {
				detailSnsPost = detailSnsPost.andWhere('theme.id IN (:...themeIds)', {
					themeIds: detailRequest.themeIds,
				});
			}

			const filterSnsPosts = await detailSnsPost.limit(detailRequest.take).getMany();
			const detailSnsPostsDto = Array.from(filterSnsPosts).map((post) => new DetailSnsPostResponseDto(post));
			const location = await this.locationsRepository.findOne({ where: { id: IsSpot.locationId } });

			return new DetailSpotResponseDto({
				...IsSpot,
				detailSnsPost: detailSnsPostsDto,
				location: new LocationResponseDto(location),
			});
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}
}
