import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import { SshConfig } from 'src/config/config.constant';
import { Spot } from 'src/entities/spots.entity';
import { TasteTheme } from 'src/entities/taste-themes.entity';
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
		private readonly configService: ConfigService,
	) {}
	#sshConfig = this.configService.get<SshConfig>('sshConfig');

	async recommendationsSpotsList(userId: number) {
		const usersTastes: UsersTasteThemesResponseDto[] = await this.getUsersTasteThemes(userId);
		const spots: UsersTasteThemesResponseDto[] = await this.getSpotsThemes();
		const allTasteThemes = await this.getAllTasteThemes();
		const inputJson = {
			usersTastes,
			spots,
			allTasteThemes,
		};

		const inputJsonFile = JSON.stringify(inputJson);

		fs.writeFileSync('./src/modules/recommendations/inputs/input.json', inputJsonFile);

		const localInputPath = './src/modules/recommendations/inputs/input.json';
		const localResultPath = './src/modules/recommendations/results/result.json';

		await ssh
			.connect({
				host: this.#sshConfig.host,
				username: this.#sshConfig.userName,
				port: this.#sshConfig.port,
				password: this.#sshConfig.password,
			}) //bash run_recommend.sh testingData/testTaste.json resultshell.json 1
			.then(async function () {
				await ssh
					.putFile(localInputPath, `/home/iknow/Desktop/blackcoffee/placeRecommender/testingData/input.json`)
					.then(async function () {
						await ssh
							.execCommand(
								`bash "/home/iknow/Desktop/blackcoffee/placeRecommender/run_recommend.sh" "/home/iknow/Desktop/blackcoffee/placeRecommender/testingData/input.json" "/home/iknow/Desktop/blackcoffee/placeRecommender/result.json" "${userId}"`,
								{},
							)
							.then(async function () {
								await ssh
									.getFile(
										localResultPath,
										'/home/iknow/Desktop/blackcoffee/placeRecommender/result.json',
									)
									.then(async function () {
										await ssh.dispose();
									});
							});
					});
			});
		const resultFile = fs.readFileSync(localResultPath);
		const resultJson = JSON.parse(resultFile.toString());
		const listRecommendationSpotIds = resultJson.listRecommendation;
		const listRecommendationSpots = await this.getSpotsUseId(listRecommendationSpotIds);
		return listRecommendationSpots.map((listRecommendationSpot) => new SearchResponseDto(listRecommendationSpot));
	}

	async recommendationsSpotsMap(userId: number): Promise<RecommendationsMapResponseDto[]> {
		const usersTastes: UsersTasteThemesResponseDto[] = await this.getUsersTasteThemes(userId);
		const spots: UsersTasteThemesResponseDto[] = await this.getSpotsThemes();
		const allTasteThemes = await this.getAllTasteThemes();
		const inputJson = {
			usersTastes,
			spots,
			allTasteThemes,
		};

		const inputJsonFile = JSON.stringify(inputJson);

		fs.writeFileSync('./src/modules/recommendations/inputs/input.json', inputJsonFile);

		const localInputPath = './src/modules/recommendations/inputs/input.json';
		const localResultPath = './src/modules/recommendations/results/result.json';

		await ssh
			.connect({
				host: this.#sshConfig.host,
				username: this.#sshConfig.userName,
				port: this.#sshConfig.port,
				password: this.#sshConfig.password,
			}) //bash run_recommend.sh testingData/testTaste.json resultshell.json 1
			.then(async function () {
				await ssh
					.putFile(localInputPath, `/home/iknow/Desktop/blackcoffee/placeRecommender/testingData/input.json`)
					.then(async function () {
						await ssh
							.execCommand(
								`bash "/home/iknow/Desktop/blackcoffee/placeRecommender/run_recommend.sh" "/home/iknow/Desktop/blackcoffee/placeRecommender/testingData/input.json" "/home/iknow/Desktop/blackcoffee/placeRecommender/result.json" "${userId}"`,
								{},
							)
							.then(async function () {
								await ssh
									.getFile(
										localResultPath,
										'/home/iknow/Desktop/blackcoffee/placeRecommender/result.json',
									)
									.then(async function () {
										await ssh.dispose();
									});
							});
					});
			});
		const resultFile = fs.readFileSync(localResultPath);
		const resultJson = JSON.parse(resultFile.toString());
		const mapRecommendationSpotIds = resultJson.mapRecommendation;
		const mapRecommendationSpots = await this.getSpotsUseId(mapRecommendationSpotIds);
		return mapRecommendationSpots.map(
			(mapRecommendationSpot) => new RecommendationsMapResponseDto(mapRecommendationSpot),
		);
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
			// return allTasteThemes.map((spot) => new RecommendationsSpotResponseDto(spot));
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	private async getSpotsUseId(spotIds: number[]) {
		try {
			const spots = await this.spotsRepository
				.createQueryBuilder('spot')
				.leftJoinAndSelect('spot.location', 'location')
				.where('spot.id IN (:...spotIds)', { spotIds })
				.getMany();

			return spots;
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}
}
