import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
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

	async recommendationsSpotsList(userId: number): Promise<SearchResponseDto[]> {
		const usersTastes: UsersTasteThemesResponseDto[] = await this.getUsersTasteThemes(userId);
		const spots: UsersTasteThemesResponseDto[] = await this.getSpotsThemes();

		console.log({
			usersTastes,
			spots,
		});

		const local_result_path = './src/modules/recommendations/results/result.json';

		const remote_path = 'data.json';
		const remore_result_path = 'result.json';

		//명령어 보내기
		ssh.connect({
			host: this.#sshConfig.host,
			username: this.#sshConfig.userName,
			port: this.#sshConfig.port,
			password: this.#sshConfig.password,
		}).then(function () {
			ssh.execCommand('cd Desktop/blackcoffee/postClassifier/', {}).then(function () {
				console.log('DONE1');
				ssh.execCommand('conda activate test0', {}).then(function () {
					console.log('DONE2');
					ssh.execCommand('python classifyPost.py testingData/raw_data_set.xlsx result.json', {}).then(
						function () {
							console.log('DONE3');
							ssh.getFile(local_result_path, 'Desktop/blackcoffee/postClassifier/result.json')
								.then(
									function (Contents) {
										console.log(Contents);
										console.log('DONE');
									},
									function (error) {
										console.log(error);
									},
								)
								.then(function () {
									ssh.dispose(); //커넥션 종료
								});
						},
					);
				});
			});
		});

		// ml에서 받아온 id들
		const recommSpotIds = [1, 2];
		const recommSpots = await this.getSpotsUseId(recommSpotIds);
		return recommSpots.map((recommSpot) => new SearchResponseDto(recommSpot));
	}

	async recommendationsSpotsMap(userId: number): Promise<RecommendationsMapResponseDto[]> {
		const usersTastes: UsersTasteThemesResponseDto[] = await this.getUsersTasteThemes(userId);
		const spots: UsersTasteThemesResponseDto[] = await this.getSpotsThemes();

		console.log({
			usersTastes,
			spots,
		});

		// ml에서 받아온 id들
		const recommSpotIds = [1, 2];
		const recommSpots = await this.getSpotsUseId(recommSpotIds);
		return recommSpots.map((recommSpot) => new RecommendationsMapResponseDto(recommSpot));
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
