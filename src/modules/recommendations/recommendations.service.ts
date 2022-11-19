import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Spot } from 'src/entities/spots.entity';
import { TasteTheme } from 'src/entities/taste-themes.entity';
import { Repository } from 'typeorm';
import { UsersTasteThemesResponseDto } from '../taste-themes/dto/users-taste-themes-response.dto';
import { RecommendationsSpotResponseDto } from './dto/recommendations-spot-response.dto';

@Injectable()
export class RecommendationsService {
	constructor(
		@InjectRepository(Spot)
		private readonly spotsRepository: Repository<Spot>,
		@InjectRepository(TasteTheme)
		private readonly tasteThemesRepository: Repository<TasteTheme>,
	) {}

	async recommendationsSpotsList(userId: number) {
		const usersTastes: UsersTasteThemesResponseDto[] = await this.getUsersTasteThemes(userId);
		const spots: UsersTasteThemesResponseDto[] = await this.getSpotsThemes();

		console.log({
			usersTastes,
			spots,
		});

		// ml에서 받아온 id들
		const recommSpotIds = [];

		return true;
	}

	// async recommendationsSpotsMap(userId: number) {}

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
}
