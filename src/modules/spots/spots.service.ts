import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as fastcsv from 'fast-csv';
import * as fs from 'fs';
import * as path from 'path';
import { firstValueFrom } from 'rxjs';

import { JwtConfig, OauthConfig, SshConfig } from 'src/config/config.constant';
import { ClickSpot } from 'src/entities/click-spots.entity';
import { Location } from 'src/entities/locations.entity';
import { SnsPost } from 'src/entities/sns-posts.entity';
import { Spot } from 'src/entities/spots.entity';
import { Theme } from 'src/entities/theme.entity';
import { WishSpot } from 'src/entities/wish-spots.entity';
import { SortType } from 'src/types/sort.types';
import { Repository } from 'typeorm';
import { RanksUpdateRequestDto } from '../ranks/dto/ranks-update-request.dto';
import { RanksService } from '../ranks/ranks.service';
import { DetailSnsPostResponseDto } from './dto/detail-sns-post-response.dto';
import { DetailSpotRequestDto } from './dto/detail-spot-request.dto';
import { DetailSpotResponseDto } from './dto/detail-spot-response.dto';
import { NeayByFacilityResponseDto } from './dto/neayby-facility-response.dto';
import { SaveRequestDto } from './dto/save-request.dto';
import { SearchPageResponseDto } from './dto/search-page-response.dto';
import { SearchRequestDto } from './dto/search-request.dto';
import { SearchResponseDto } from './dto/search-response.dto';
import { SnsPhotoJsonDto } from './dto/sns-photo-json.dto';
import { SnsPostRequestDto } from './dto/sns-post-request.dto';
import { SpotRequestDto } from './dto/spot-request.dto';
import { SpotsJsonDto } from './dto/spots-json.dto';
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
		@InjectRepository(ClickSpot)
		private readonly clickSpotsRepository: Repository<ClickSpot>,
		@InjectRepository(WishSpot)
		private readonly wishSpotsRepository: Repository<WishSpot>,
		private readonly ranksService: RanksService,
		private readonly configService: ConfigService,
		private readonly httpService: HttpService,
		private readonly jwtService: JwtService,
	) {}
	#sshConfig = this.configService.get<SshConfig>('sshConfig');
	#oauthConfig = this.configService.get<OauthConfig>('oauthConfig').kakao;
	#jwtConfig = this.configService.get<JwtConfig>('jwtConfig');
	async createSpots(file: Express.Multer.File) {
		if (!file) throw new BadRequestException('File is not exist');
		const fileName: string = file.filename;
		const snsPosts: SpotsJsonDto[] = await this.readCsv(path.resolve('src/database/datas', fileName));
		const resultJson = [];

		for (const snsPost of snsPosts) {
			let locationData;
			try {
				locationData = await firstValueFrom(
					this.httpService.get(
						`https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURI(snsPost.place)}`,
						{
							headers: {
								Authorization: `KakaoAK ${this.#oauthConfig.clientId}`,
							},
						},
					),
				);
				if (locationData && locationData.data.documents.length > 0)
					resultJson.push({
						...snsPost,
						addressName: locationData.data.documents[0].address_name,
						placeName: locationData.data.documents[0].place_name,
						latitude: locationData.data.documents[0].y,
						longitude: locationData.data.documents[0].x,
					});
			} catch (error) {
				continue;
			}
		}
		const resultJsonFile = JSON.stringify(resultJson);
		fs.writeFileSync('./src/modules/spots/inputs/input.json', resultJsonFile);

		const localInputPath = './src/modules/spots/inputs/input.json';
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
					.putFile(localInputPath, `/home/iknow/Desktop/blackcoffee/postClassifier/testingData/input.json`)
					.then(async function () {
						await ssh
							.execCommand(
								`bash "/home/iknow/Desktop/blackcoffee/postClassifier/run_classify.sh" "/home/iknow/Desktop/blackcoffee/postClassifier/testingData/input.json" "/home/iknow/Desktop/blackcoffee/postClassifier/spotresult4.json"`,
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

	async getSnsPostUrls() {
		try {
			const snsPostUrls = await this.snsPostRepository
				.createQueryBuilder('snsPost')
				.select('snsPost.snsPostUrl')
				.getMany();
			let text = '';
			for (const snsPostUrlData of snsPostUrls) {
				text += snsPostUrlData.snsPostUrl + '\n';
			}
			fs.writeFileSync('./test.txt', text);

			return true;
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	async updateSnsPostPhotos(file: Express.Multer.File) {
		if (!file) throw new BadRequestException('File is not exist');
		const fileName: string = file.filename;
		const snsPhotos: SnsPhotoJsonDto[] = await this.readCsvSnsPostPhotoUrls(
			path.resolve('src/database/datas', fileName),
		);
		for (const snsPhoto of snsPhotos) {
			if (snsPhoto.photoUrl === '-') await this.snsPostRepository.delete({ snsPostUrl: snsPhoto.snsPostUrl });
			else {
				await this.snsPostRepository.update(
					{
						snsPostUrl: snsPhoto.snsPostUrl,
					},
					{ photoUrl: snsPhoto.photoUrl },
				);
			}
		}
		return true;
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
							item.address === character.address &&
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
				let location = this.locationsRepository
					.createQueryBuilder('location')
					.where('metro_name = :metro', { metro: spot.metroName });
				if (spot.localName === null) location = location.andWhere('location.local_name is null');
				else location = location.andWhere('local_name = :local', { local: spot.localName });
				const oneLocation = await location.getOne();
				if (!oneLocation) continue;
				await this.createSpot(
					new SpotRequestDto({
						locationId: oneLocation.id,
						name: spot.name,
						address: spot.address,
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
							item.snsPostUrl === character.snsPostUrl &&
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
						snsPostUrl: sns.snsPostUrl,
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
		const IsSnsPost = await this.snsPostRepository.findOne({ where: { snsPostUrl: requestSnsPost.snsPostUrl } });
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
	private async allSelection(locationIds) {
		return await this.locationsRepository
			.createQueryBuilder('location')
			.leftJoinAndSelect('location.spots', 'spots')
			.select('location.id AS id')
			.where((metroNames) => {
				const subQuery = metroNames
					.subQuery()
					.select('location.metroName')
					.where('location.localName is null')
					.andWhere('location.id IN (:...ids)', { ids: locationIds })
					.from(Location, 'location')
					.getQuery();
				return 'location.metroName IN' + subQuery;
			})
			.andWhere('spots.id is not null')
			.distinctOn(['location.id'])
			.getRawMany();
	}
	async getSearchSpot(header: string, searchRequest: SearchRequestDto) {
		try {
			let searchSpots = this.spotsRepository
				.createQueryBuilder('spot')
				.leftJoinAndSelect('spot.snsPosts', 'snsPosts')
				.select('spot.id AS id, spot.address AS address, spot.name AS name, spot.rank AS rank')
				.addSelect((clicks) => {
					return clicks
						.select('COUNT (*)::int AS clicks')
						.from(ClickSpot, 'clickSpots')
						.where('clickSpots.spotId = spot.id')
						.limit(1);
				}, 'clicks')
				.addSelect((wishes) => {
					return wishes
						.select('COUNT (*)::int AS wishes')
						.from(WishSpot, 'wishSpots')
						.where('wishSpots.spotId = spot.id')
						.limit(1);
				}, 'wishes')
				.addSelect((photoUrl) => {
					return photoUrl
						.select('snsPosts.photoUrl', 'photoUrl')
						.from(SnsPost, 'snsPosts')
						.where('snsPosts.spotId = spot.id')
						.limit(1);
				}, 'photoUrl')
				.where('snsPosts.photoUrl is not null')
				.distinct(true);

			if (searchRequest.word) {
				searchSpots = searchSpots.andWhere('spot.name Like :name', { name: `%${searchRequest.word}%` });
			}
			if (searchRequest.locationIds && searchRequest.locationIds[0] !== 0) {
				let locationIds = searchRequest.locationIds;
				const allMetros = await this.allSelection(locationIds);
				const localsIds = Array.from(allMetros).flatMap(({ id }) => [id]);
				locationIds = [...new Set(locationIds.concat(localsIds))];
				searchSpots = searchSpots
					.leftJoinAndSelect('spot.location', 'location')
					.andWhere('location.id IN (:...locationIds)', { locationIds: locationIds });
			}
			if (searchRequest.themeIds && searchRequest.themeIds[0] !== 0) {
				searchSpots = searchSpots
					.leftJoinAndSelect('snsPosts.theme', 'theme')
					.andWhere('theme.id IN (:...themeIds)', { themeIds: searchRequest.themeIds });
			}

			if (searchRequest.sorter === SortType.Rank) searchSpots = searchSpots.orderBy('spot.rank', 'ASC');
			else if (searchRequest.sorter === SortType.View) searchSpots = searchSpots.orderBy('clicks', 'DESC');
			else if (searchRequest.sorter === SortType.Wish) searchSpots = searchSpots.orderBy('wishes', 'DESC');

			const totalPageSpots = await searchSpots.getRawMany();
			const responseSpots = await searchSpots
				.limit(searchRequest.take)
				.offset((searchRequest.page - 1) * searchRequest.take)
				.getRawMany();

			const totalPage = Math.ceil(totalPageSpots.length / searchRequest.take);
			let order = totalPageSpots.length - (searchRequest.page - 1) * searchRequest.take;
			const spots = [];
			for (const spot of responseSpots) {
				let isWish = false;
				if (header) {
					const token = header.replace('Bearer ', '');
					const user = this.jwtService.verify(token, { secret: this.#jwtConfig.jwtAccessTokenSecret });

					if (await this.isUsersWishSpot(user.id, spot.id)) isWish = true;
				}
				spots.push(
					new SearchResponseDto({
						...spot,
						order: order--,
						views: spot.clicks,
						wishes: spot.wishes,
						isWish,
					}),
				);
			}

			return new SearchPageResponseDto({ totalPage: totalPage, spots: spots });
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}
	async getDetailSpot(header: string, detailRequest: DetailSpotRequestDto, spotId: number) {
		const IsSpot = await this.spotsRepository
			.createQueryBuilder('spot')
			.where('spot.id = :spotId', { spotId })
			.leftJoinAndSelect('spot.clickSpots', 'clickSpots')
			.leftJoinAndSelect('spot.wishSpots', 'wishSpots')
			.getOne();
		if (!IsSpot) throw new NotFoundException('Spot is not found');
		try {
			let isWish = false;
			if (header) {
				const token = header.replace('Bearer ', '');
				const user = this.jwtService.verify(token, { secret: this.#jwtConfig.jwtAccessTokenSecret });
				const clickSpotData = this.clickSpotsRepository.create({
					userId: user.id,
					spotId,
				});
				await this.clickSpotsRepository.save(clickSpotData);
				const usersWishData = await this.wishSpotsRepository
					.createQueryBuilder('wishSpot')
					.where('wishSpot.userId = :userId', { userId: user.id })
					.andWhere('wishSpot.spotId = :spotId', { spotId })
					.getOne();
				if (usersWishData) isWish = true;
			}
			const detailSnsPosts = await this.snsPostRepository
				.createQueryBuilder('snsPost')
				.leftJoinAndSelect('snsPost.spot', 'spot')
				.leftJoinAndSelect('snsPost.theme', 'theme')
				.where('spot.id = :spotId', { spotId })
				.orderBy('snsPost.likeNumber', 'DESC')
				.limit(detailRequest.take)
				.getMany();
			const detailSnsPostsDto = Array.from(detailSnsPosts).map((post) => new DetailSnsPostResponseDto(post));
			const facilitiesDto = await this.getNearbyFacility(IsSpot.latitude, IsSpot.longitude);
			return new DetailSpotResponseDto({
				...IsSpot,
				isWish,
				views: IsSpot.clickSpots.length + 1,
				wishes: IsSpot.wishSpots.length,
				detailSnsPost: detailSnsPostsDto,
				neaybyFacility: facilitiesDto,
			});
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}
	async wishSpot(userId: number, spotId: number, isWish: boolean): Promise<boolean> {
		const IsSpot = await this.spotsRepository
			.createQueryBuilder('spot')
			.where('spot.id = :spotId', { spotId })
			.getOne();

		if (!IsSpot) throw new NotFoundException('Spot is not found');
		if (isWish) {
			const isWishSpot = await this.wishSpotsRepository
				.createQueryBuilder('wishSpot')
				.where('wishSpot.userId = :userId', { userId })
				.andWhere('wishSpot.spotId = :spotId', { spotId })
				.getOne();
			if (!isWishSpot) {
				const wishSpot = this.wishSpotsRepository.create({
					userId,
					spotId,
				});
				await this.wishSpotsRepository.save(wishSpot);
			} else throw new BadRequestException('User already wishes spot');
		} else {
			await this.wishSpotsRepository.delete({
				userId,
				spotId,
			});
		}
		return true;
	}
	private async getNearbyFacility(latitude, longitude) {
		try {
			const kakaoRequestApiMapResult = await firstValueFrom(
				this.httpService.get(
					`https://dapi.kakao.com/v2/local/search/category.json?category\_group\_code=PK6,FD6,CE7&y=${latitude}&x=${longitude}&radius=20000&sort=distance`,
					{
						headers: {
							Authorization: `KakaoAK ${this.#oauthConfig.clientId}`,
						},
					},
				),
			);
			return kakaoRequestApiMapResult.data.documents.map(
				(facility) =>
					new NeayByFacilityResponseDto({
						name: facility.place_name,
						placeUrl: facility.place_url,
						address: facility.address_name,
						distance: +facility.distance,
						category: facility.category_name,
					}),
			);
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	private async isUsersWishSpot(userId: number, spotId: number): Promise<boolean> {
		const usersWishData = await this.wishSpotsRepository
			.createQueryBuilder('wishSpot')
			.where('wishSpot.userId = :userId', { userId })
			.andWhere('wishSpot.spotId = :spotId', { spotId })
			.getOne();

		if (usersWishData) return true;
		return false;
	}

	private async readCsv(filePath: string): Promise<SpotsJsonDto[]> {
		return new Promise((resolve, reject) => {
			const csvData: SpotsJsonDto[] = [];
			const csvStream = fs.createReadStream(filePath);
			const csvParser = fastcsv.parse({ headers: true });

			csvStream
				.pipe(csvParser)
				.on('error', (err) => {
					throw new InternalServerErrorException(err);
				})
				.on('data', (row) => {
					const place = row.place;
					const snsPostUrl = row.snsPostUrl;
					const photoUrl = row.photoUrl;
					const datetime = new Date(row.datetime);
					const like = row.like;
					const text = row.text;
					csvData.push(
						new SpotsJsonDto({
							place,
							snsPostUrl,
							photoUrl,
							datetime,
							like,
							text,
						}),
					);
				})
				.on('end', () => {
					resolve(csvData);
				});
		});
	}

	private async readCsvSnsPostPhotoUrls(filePath: string): Promise<SnsPhotoJsonDto[]> {
		return new Promise((resolve, reject) => {
			const csvData: SnsPhotoJsonDto[] = [];
			const csvStream = fs.createReadStream(filePath);
			const csvParser = fastcsv.parse({ headers: true });

			csvStream
				.pipe(csvParser)
				.on('error', (err) => {
					throw new InternalServerErrorException(err);
				})
				.on('data', (row) => {
					const snsPostUrl = row.snsPostUrl;
					const photoUrl = row.photoUrl;
					csvData.push(
						new SnsPhotoJsonDto({
							snsPostUrl,
							photoUrl,
						}),
					);
				})
				.on('end', () => {
					resolve(csvData);
				});
		});
	}
}
