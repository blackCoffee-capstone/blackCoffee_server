import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Rank } from 'src/entities/rank.entity';
import { Spot } from 'src/entities/spots.entity';
import { RankingRequestDto } from './dto/ranking-request.dto';
import { RanksRecordRequestDto } from './dto/ranks-record-request.dto';
import { RankingListResponseDto } from './dto/ranking-list-response.dto';
import { RankingMapResponseDto } from './dto/ranking-map-response.dto';
import { LocationResponseDto } from '../filters/dto/location-response.dto';

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
						.where('rankings.date = :afterDate', { afterDate: rankingRequest.date })
						.andWhere('rankings.spotId = spot.id')
						.from(Rank, 'rankings')
						.limit(1);
				}, 'after_rank')
				.addSelect((berforRank) => {
					return berforRank
						.select('rankings.rank', 'before_rank')
						.where('rankings.Date = :beforeDate', { beforeDate: rankingRequest.date - 1 })
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
				.where('rankings.date = :date', { date: rankingRequest.date })
				.getMany();

			return Array.from(rankingMapSpots).map((post) => new RankingMapResponseDto(post));
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	async updateRank(rankNumer: number, spotId: number) {
		try {
			await this.spotsRepository.update(spotId, { rank: rankNumer });

			const rankingRequestDto = new RankingRequestDto();
			const ranksRequestDto = new RanksRecordRequestDto({
				date: rankingRequestDto.getDate,
				spotId: spotId,
				rank: rankNumer,
			});
			const rank = await this.ranksRepository.findOne({ where: { ...ranksRequestDto } });
			if (!rank) await this.ranksRepository.save(ranksRequestDto);
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}
}
