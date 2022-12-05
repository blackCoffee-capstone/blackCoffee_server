import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import { SshConfig } from 'src/config/config.constant';
import { ClickSpot } from 'src/entities/click-spots.entity';
import { Spot } from 'src/entities/spots.entity';
import { TasteTheme } from 'src/entities/taste-themes.entity';
import { WishSpot } from 'src/entities/wish-spots.entity';
import { Repository } from 'typeorm';
import { SearchResponseDto } from '../spots/dto/search-response.dto';
import { UsersTasteThemesResponseDto } from '../taste-themes/dto/users-taste-themes-response.dto';
import { RecommendationsMapResponseDto } from './dto/recommendations-map-response.dto';
import { RecommendationsSpotResponseDto } from './dto/recommendations-spot-response.dto';

const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

@Injectable()
export class RecommendationsService {
	constructor(
		@InjectRepository(Spot)
		private readonly spotsRepository: Repository<Spot>,
		@InjectRepository(TasteTheme)
		private readonly tasteThemesRepository: Repository<TasteTheme>,
		@InjectRepository(WishSpot)
		private readonly wishSpotsRepository: Repository<WishSpot>,
		@InjectRepository(ClickSpot)
		private readonly clickSpotsRepository: Repository<ClickSpot>,
		private readonly configService: ConfigService,
	) {}
	#sshConfig = this.configService.get<SshConfig>('sshConfig');

	async recommendationsSpotsList(userId: number): Promise<SearchResponseDto[]> {
		const usersTastes: UsersTasteThemesResponseDto[] = await this.getUsersTasteThemes(userId);
		if (usersTastes.length === 0) {
			throw new BadRequestException('Users taste themes is not exist');
		}
		const inputJson = {
			userId,
			usersTastes,
		};
		const inputJsonFile = JSON.stringify(inputJson);

		fs.writeFileSync('./src/modules/recommendations/inputs/list-input.json', inputJsonFile);

		const localInputPath = './src/modules/recommendations/inputs/list-input.json';
		const localResultPath = './src/modules/recommendations/results/list-result.json';

		await ssh
			.connect({
				host: this.#sshConfig.host,
				username: this.#sshConfig.userName,
				port: this.#sshConfig.port,
				password: this.#sshConfig.password,
			})
			.then(
				async function () {
					await ssh
						.putFile(
							localInputPath,
							`/home/iknow/Desktop/blackcoffee/placeRecommender/testingData/list-input.json`,
						)
						.then(
							async function () {
								await ssh
									.execCommand(
										`bash "/home/iknow/Desktop/blackcoffee/placeRecommender/run_recommendwithHybridSys.sh" "/home/iknow/Desktop/blackcoffee/placeRecommender/testingData/list-input.json" "/home/iknow/Desktop/blackcoffee/placeRecommender/list-result.json"`,
										{},
									)
									.then(
										async function () {
											await ssh
												.getFile(
													localResultPath,
													'/home/iknow/Desktop/blackcoffee/placeRecommender/list-result.json',
												)
												.then(
													async function () {
														await ssh.dispose();
													},
													function (error) {
														return 0;
													},
												);
										},
										function (error) {
											return 0;
										},
									);
							},
							function (error) {
								return 0;
							},
						);
				},
				function (error) {
					return 0;
				},
			);
		const resultFile = fs.readFileSync(localResultPath);
		const resultJson = JSON.parse(resultFile.toString());
		const listRecommendationSpotIds = resultJson.listRecommendation;
		const listRecommendationSpots = await this.getSpotsUseId(listRecommendationSpotIds);

		const results: SearchResponseDto[] = [];
		let order = 1;
		for (const listRecommendationSpot of listRecommendationSpots) {
			let isWish = false;
			if (await this.isUsersWishSpot(userId, listRecommendationSpot.id)) isWish = true;

			results.push(
				new SearchResponseDto({
					...listRecommendationSpot,
					order: order++,
					views: listRecommendationSpot.clickSpots.length,
					wishes: listRecommendationSpot.wishSpots.length,
					isWish,
					photoUrl: listRecommendationSpot.snsPosts[0].photoUrl,
				}),
			);
		}
		return results;
	}

	async recommendationsSpotsMap(userId: number): Promise<RecommendationsMapResponseDto[]> {
		const usersTastes: UsersTasteThemesResponseDto[] = await this.getUsersTasteThemes(userId);
		if (usersTastes.length === 0) {
			throw new BadRequestException('Users taste themes is not exist');
		}
		const inputJson = {
			userId,
			usersTastes,
		};

		const inputJsonFile = JSON.stringify(inputJson);

		fs.writeFileSync('./src/modules/recommendations/inputs/map-input.json', inputJsonFile);

		const localInputPath = './src/modules/recommendations/inputs/map-input.json';
		const localResultPath = './src/modules/recommendations/results/map-result.json';

		await ssh
			.connect({
				host: this.#sshConfig.host,
				username: this.#sshConfig.userName,
				port: this.#sshConfig.port,
				password: this.#sshConfig.password,
			})
			.then(
				async function () {
					await ssh
						.putFile(
							localInputPath,
							`/home/iknow/Desktop/blackcoffee/placeRecommender/testingData/map-input.json`,
						)
						.then(
							async function () {
								await ssh
									.execCommand(
										`bash "/home/iknow/Desktop/blackcoffee/placeRecommender/run_recommendwithHybridSys.sh" "/home/iknow/Desktop/blackcoffee/placeRecommender/testingData/map-input.json" "/home/iknow/Desktop/blackcoffee/placeRecommender/map-result.json"`,
										{},
									)
									.then(
										async function () {
											await ssh
												.getFile(
													localResultPath,
													'/home/iknow/Desktop/blackcoffee/placeRecommender/map-result.json',
												)
												.then(
													async function () {
														await ssh.dispose();
													},
													function (error) {
														return 0;
													},
												);
										},
										function (error) {
											return 0;
										},
									);
							},
							function (error) {
								return 0;
							},
						);
				},
				function (error) {
					return 0;
				},
			);
		const resultFile = fs.readFileSync(localResultPath);
		const resultJson = JSON.parse(resultFile.toString());
		const mapRecommendationSpotIds = resultJson.mapRecommendation;
		const mapRecommendationSpots = await this.getSpotsUseId(mapRecommendationSpotIds);
		return mapRecommendationSpots.map(
			(mapRecommendationSpot) => new RecommendationsMapResponseDto(mapRecommendationSpot),
		);
	}

	async updateMlRecommendations(): Promise<boolean> {
		const spots: UsersTasteThemesResponseDto[] = await this.getSpotsThemes();
		const allTasteThemes = await this.getAllTasteThemes();
		const allClickSpots = await this.getAllClickSpots();
		const allWishSpots = await this.getAllWishSpots();

		const spotsJsonFile = JSON.stringify(spots);
		const allTasteThemesJsonFile = JSON.stringify(allTasteThemes);
		const allClickSpotsJsonFile = JSON.stringify(allClickSpots);
		const allWishSpotsJsonFile = JSON.stringify(allWishSpots);

		fs.writeFileSync('./src/modules/recommendations/inputs/spots.json', spotsJsonFile);
		fs.writeFileSync('./src/modules/recommendations/inputs/taste-themes.json', allTasteThemesJsonFile);
		fs.writeFileSync('./src/modules/recommendations/inputs/click-spots.json', allClickSpotsJsonFile);
		fs.writeFileSync('./src/modules/recommendations/inputs/wish-spots.json', allWishSpotsJsonFile);

		const localInputSpotsPath = './src/modules/recommendations/inputs/spots.json';
		const localInputTasteThemesPath = './src/modules/recommendations/inputs/taste-themes.json';
		const localInputClickSpotsPath = './src/modules/recommendations/inputs/click-spots.json';
		const localInputWishSpotsPath = './src/modules/recommendations/inputs/wish-spots.json';

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
						localInputSpotsPath,
						`/home/iknow/Desktop/blackcoffee/placeRecommender/testingData/input_spots.json`,
					)
					.then(async function () {
						await ssh
							.putFile(
								localInputTasteThemesPath,
								`/home/iknow/Desktop/blackcoffee/placeRecommender/testingData/input_taste_themes.json`,
							)
							.then(async function () {
								await ssh
									.putFile(
										localInputClickSpotsPath,
										`/home/iknow/Desktop/blackcoffee/placeRecommender/testingData/input_click_spots.json`,
									)
									.then(async function () {
										await ssh
											.putFile(
												localInputWishSpotsPath,
												`/home/iknow/Desktop/blackcoffee/placeRecommender/testingData/input_wish_spots.json`,
											)
											.then(async function () {
												await ssh
													.execCommand(
														`bash "/home/iknow/Desktop/blackcoffee/placeRecommender/run_training.sh" "/home/iknow/Desktop/blackcoffee/placeRecommender/testingData/input_taste_themes.json" "/home/iknow/Desktop/blackcoffee/placeRecommender/testingData/input_spots.json" "/home/iknow/Desktop/blackcoffee/placeRecommender/testingData/input_wish_spots.json" "/home/iknow/Desktop/blackcoffee/placeRecommender/testingData/input_click_spots.json" True`,
														{},
													)
													.then(async function () {
														await ssh.dispose();
													});
											});
									});
							});
					});
			});

		return true;
	}

	private async getUsersTasteThemes(userId: number): Promise<UsersTasteThemesResponseDto[]> {
		try {
			const foundUsersThemes = await this.tasteThemesRepository
				.createQueryBuilder('taste_theme')
				.select('theme.id, theme.name')
				.leftJoin('taste_theme.user', 'user')
				.leftJoin('taste_theme.theme', 'theme')
				.where('user.id = :id', { id: userId })
				.getRawMany();
			if (!foundUsersThemes) {
				throw new BadRequestException('User taste theme is not found');
			}
			return foundUsersThemes.map((theme) => new UsersTasteThemesResponseDto({ id: theme.id, name: theme.name }));
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	private async getSpotsThemes(): Promise<RecommendationsSpotResponseDto[]> {
		try {
			const spots = await this.spotsRepository
				.createQueryBuilder('spot')
				.select(
					'spot.id, spot.name, spot.latitude, spot.longitude, spot.rank, spot.snsPostCount, spot.snsPostLikeNumber, location.metroName, location.localName, array_agg("theme".name) as "themes"',
				)
				.leftJoin('spot.location', 'location')
				.leftJoin('spot.snsPosts', 'snsPosts')
				.leftJoin('snsPosts.theme', 'theme')
				.groupBy('spot.id, location.id')
				.getRawMany();

			return spots.map((spot) => new RecommendationsSpotResponseDto(spot));
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	private async getAllTasteThemes() {
		try {
			const allTasteThemes = await this.tasteThemesRepository
				.createQueryBuilder('taste_theme')
				.select('user.id, array_agg("theme".name) as "themes"')
				.leftJoin('taste_theme.user', 'user')
				.leftJoin('taste_theme.theme', 'theme')
				.groupBy('user.id')
				.getRawMany();
			return allTasteThemes;
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	private async getSpotsUseId(spotIds: number[]) {
		try {
			const spots = await this.spotsRepository
				.createQueryBuilder('spot')
				.leftJoinAndSelect('spot.location', 'location')
				.leftJoinAndSelect('spot.clickSpots', 'clickSpots')
				.leftJoinAndSelect('spot.wishSpots', 'wishSpots')
				.leftJoinAndSelect('spot.snsPosts', 'snsPosts')
				.where('spot.id IN (:...spotIds)', { spotIds })
				.andWhere('snsPosts.photoUrl is not null')
				.getMany();

			return spots;
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

	private async getAllClickSpots() {
		const allClickSpots = await this.clickSpotsRepository
			.createQueryBuilder('clickSpot')
			.select('clickSpot.spot_id, clickSpot.user_id, clickSpot.createdAt')
			.getRawMany();

		return allClickSpots;
	}

	private async getAllWishSpots() {
		const allWishSpots = await this.wishSpotsRepository
			.createQueryBuilder('wishSpot')
			.select('wishSpot.spot_id, wishSpot.user_id, wishSpot.createdAt')
			.getRawMany();

		return allWishSpots;
	}
}
