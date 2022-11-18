import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Rank } from 'src/entities/rank.entity';
import { Spot } from 'src/entities/spots.entity';
import { RankingRequestDto } from './dto/ranking-request.dto';
import { RankingListResponseDto } from './dto/ranking-list-response.dto';
import { RanksRecordRequestDto } from './dto/ranks-record-request.dto';
import { LocationResponseDto } from '../filters/dto/location-response.dto';
import { RankingMapResponseDto } from './dto/ranking-map-response.dto';

@Injectable()
export class RanksService {
	constructor(
		@InjectRepository(Spot)
		private readonly spotsRepository: Repository<Spot>,
		@InjectRepository(Rank)
		private readonly ranksRepository: Repository<Rank>,
	) {}

	async filterWeek(week: number, beforeFilterWeek) {
		const afterFilterWeek = beforeFilterWeek
			.where('rankings.week = :week', { week: week })
			.orderBy('rankings.rank', 'ASC')
			.getRawMany();
		console.log(afterFilterWeek);
		return afterFilterWeek;
	}

	async getRanksList(rankingRequest: RankingRequestDto) {
		console.log(rankingRequest);
		try {
			const rankingListSpots = await this.spotsRepository
				.createQueryBuilder('spot')
				.innerJoinAndSelect('spot.location', 'location')
				.select('spot.id AS id, spot.name AS name')
				.addSelect('location.id AS location_id, location.metroName AS metro, location.localName AS local')
				.where('spot.rank is not null')
				.addSelect((afterRank) => {
					return afterRank
						.select('rankings.rank', 'after_rank')
						.where('rankings.week = :afterWeek', { afterWeek: rankingRequest.week })
						.andWhere('rankings.spotId = spot.id')
						.from(Rank, 'rankings')
						.limit(1);
				}, 'after_rank')
				.addSelect((berforRank) => {
					return berforRank
						.select('rankings.rank', 'before_rank')
						.where('rankings.week = :beforeWeek', { beforeWeek: rankingRequest.week - 1 })
						.andWhere('rankings.spotId = spot.id')
						.from(Rank, 'rankings')
						.limit(1);
				}, 'before_rank')
				.getRawMany();

			return Array.from(rankingListSpots).map(
				(post) =>
					new RankingListResponseDto({
						...post,
						variance: post.before_rank - post.current_rank,
						location: new LocationResponseDto({
							id: post.location_id,
							metroName: post.metro,
							localName: post.local,
						}),
					}),
			);
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	async getRanksMap(rankingRequest: RankingRequestDto) {
		try {
			const rankingMapSpots = await this.spotsRepository
				.createQueryBuilder('spot')
				.leftJoinAndSelect('spot.rankings', 'rankings')
				.where('rankings.week = :week', { week: rankingRequest.week })
				.getMany();

			return Array.from(rankingMapSpots).map((post) => new RankingMapResponseDto(post));
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	async updateRank(requestRank, spotId: number) {
		try {
			await this.spotsRepository.update(spotId, { rank: requestRank.rank });

			const week = requestRank.getWeek;
			const date = new Date();
			const ranksRequestDto = new RanksRecordRequestDto({
				year: date.getFullYear(),
				month: date.getMonth() + 1,
				week: week,
				spotId: spotId,
				rank: requestRank.rank,
			});
			const rank = await this.ranksRepository.findOne({ where: { ...ranksRequestDto } });
			if (!rank) await this.ranksRepository.save(ranksRequestDto);
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}
}
