import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ClickSpot } from 'src/entities/click-spots.entity';
import { Rank } from 'src/entities/rank.entity';
import { SnsPost } from 'src/entities/sns-posts.entity';
import { Spot } from 'src/entities/spots.entity';
import { WishSpot } from 'src/entities/wish-spots.entity';
import { RankingListResponseDto } from './dto/ranking-list-response.dto';
import { RankingMapResponseDto } from './dto/ranking-map-response.dto';
import { RankingRequestDto } from './dto/ranking-request.dto';
import { RankingResponseDto } from './dto/ranking-response.dto';
import { RanksRecordRequestDto } from './dto/ranks-record-request.dto';
import { RanksUpdateRequestDto } from './dto/ranks-update-request.dto';

@Injectable()
export class RanksService {
	constructor(
		@InjectRepository(Spot)
		private readonly spotsRepository: Repository<Spot>,
		@InjectRepository(Rank)
		private readonly ranksRepository: Repository<Rank>,
	) {}

	private async weekCalulation(rankingRequest: RankingRequestDto) {
		const nextCheckWeek = await this.ranksRepository.createQueryBuilder('rank').orderBy('date', 'DESC').getOne();
		if (!nextCheckWeek) return [null, null];
		if (rankingRequest.date > nextCheckWeek.date) return [nextCheckWeek.date, null];

		const previousCheckWeek = await this.ranksRepository.createQueryBuilder('rank').orderBy('date', 'ASC').getOne();
		if (rankingRequest.date < previousCheckWeek.date) return [null, previousCheckWeek.date];

		const beforeCheckWeek = await this.ranksRepository
			.createQueryBuilder('rank')
			.select('date')
			.distinctOn(['date'])
			.orderBy('date', 'ASC')
			.getRawMany();

		let weekList = Array.from(beforeCheckWeek).flatMap(({ date }) => [date]);
		weekList.push(rankingRequest.date);
		weekList = [...new Set(weekList.sort())];
		const dateIdx = weekList.lastIndexOf(rankingRequest.date);

		return [weekList[dateIdx - 1], weekList[dateIdx + 1]];
	}

	async getRanksList(rankingRequest: RankingRequestDto) {
		const week = await this.weekCalulation(rankingRequest);

		try {
			let rankingListSpotsQuery = this.spotsRepository
				.createQueryBuilder('spot')
				.innerJoinAndSelect('spot.location', 'location')
				.innerJoinAndSelect('spot.rankings', 'rankings')
				.where('rankings.date = :date', { date: rankingRequest.date })
				.andWhere('rankings.rank >= 1')
				.andWhere('rankings.rank <= 20');

			const rankingListSpotsQueryData = await rankingListSpotsQuery.orderBy('rankings.rank', 'ASC').getMany();

			if (rankingListSpotsQueryData.length !== 20) {
				let rankIndex = 1;
				const allOriginRankingsData = await this.spotsRepository
					.createQueryBuilder('spot')
					.innerJoinAndSelect('spot.location', 'location')
					.innerJoinAndSelect('spot.rankings', 'rankings')
					.where('rankings.date = :date', { date: rankingRequest.date })
					.orderBy('rankings.rank', 'ASC')
					.getMany();

				for (const allOriginRanking of allOriginRankingsData) {
					await this.ranksRepository.update(
						{ spotId: allOriginRanking.id },
						{
							rank: rankIndex++,
						},
					);
					if (rankIndex === 21) break;
				}
			}

			rankingListSpotsQuery = this.spotsRepository
				.createQueryBuilder('spot')
				.innerJoinAndSelect('spot.location', 'location')
				.innerJoinAndSelect('spot.rankings', 'rankings')
				.where('rankings.date = :date', { date: rankingRequest.date })
				.andWhere('rankings.rank >= 1')
				.andWhere('rankings.rank <= 20');

			const rankingListSpots = await rankingListSpotsQuery
				.select('spot.id AS id, spot.name AS name, spot.address AS address')
				.addSelect('location.id AS location_id, location.metroName AS metro, location.localName AS local')
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
						.where('rankings.Date = :beforeDate', { beforeDate: week[0] })
						.andWhere('rankings.spotId = spot.id')
						.from(Rank, 'rankings')
						.limit(1);
				}, 'before_rank')
				.addSelect((wishes) => {
					return wishes
						.select('COUNT (*)', 'wishSpots')
						.from(WishSpot, 'wishSpots')
						.where('wishSpots.spotId = spot.id')
						.limit(1);
				}, 'wishes')
				.addSelect((clicks) => {
					return clicks
						.select('COUNT (*)', 'clickSpots')
						.from(ClickSpot, 'clickSpots')
						.where('clickSpots.spotId = spot.id')
						.limit(1);
				}, 'clicks')
				.addSelect((photo) => {
					return photo
						.select('snsPosts.photoUrl', 'photo')
						.from(SnsPost, 'snsPosts')
						.where('snsPosts.spotId = spot.id')
						.limit(1);
				}, 'photo')
				.orderBy('after_rank', 'ASC')
				.getRawMany();

			let ranking = Array.from(rankingListSpots).map(function (spot) {
				return new RankingListResponseDto({
					...spot,
					rank: spot.after_rank,
					variance: spot.before_rank ? spot.before_rank - spot.after_rank : null,
					views: +spot.clicks,
					wishes: +spot.wishes,
					photoUrl: spot.photo,
				});
			});
			ranking = ranking.filter((spot) => spot.photoUrl !== null);
			return new RankingResponseDto({
				prev: week[0] ? week[0] : null,
				next: week[1] ? week[1] : null,
				ranking: ranking,
			});
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	async getRanksMap(rankingRequest: RankingRequestDto) {
		try {
			const week = await this.weekCalulation(rankingRequest);

			const rankingMapSpots = await this.spotsRepository
				.createQueryBuilder('spot')
				.innerJoinAndSelect('spot.location', 'location')
				.innerJoinAndSelect('spot.rankings', 'rankings')
				.where('rankings.date = :date', { date: rankingRequest.date })
				.select(
					'spot.id AS id, spot.name AS name, spot.latitude AS latitude, spot.longitude AS longitude, spot.address AS address',
				)
				.addSelect('location.id AS location_id, location.metroName AS metro, location.localName AS local')
				.addSelect((currentRank) => {
					return currentRank
						.select('rankings.rank', 'current_rank')
						.where('rankings.date = :currentDate', { currentDate: rankingRequest.date })
						.andWhere('rankings.spotId = spot.id')
						.from(Rank, 'rankings')
						.limit(1);
				}, 'current_rank')
				.orderBy('current_rank', 'ASC')
				.getRawMany();

			const ranking = Array.from(rankingMapSpots).map(function (spot) {
				return new RankingMapResponseDto({
					...spot,
					rank: spot.current_rank,
				});
			});
			return new RankingResponseDto({
				prev: week[0] ? week[0] : null,
				next: week[1] ? week[1] : null,
				ranking: ranking,
			});
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	async updateRank(updateRequest: RanksUpdateRequestDto) {
		try {
			await this.spotsRepository.update(updateRequest.spotId, { rank: updateRequest.rank });

			const rankingRequestDto = new RankingRequestDto();
			const rank = await this.ranksRepository.findOne({
				where: { date: rankingRequestDto.getDate, rank: updateRequest.rank },
			});
			if (rank && rank.spotId !== updateRequest.spotId) {
				await this.ranksRepository.update(
					{ date: rankingRequestDto.getDate, rank: updateRequest.rank },
					{ spotId: updateRequest.spotId },
				);
			}
			if (!rank && updateRequest.rank) {
				const ranksRequestDto = new RanksRecordRequestDto({
					date: rankingRequestDto.getDate,
					spotId: updateRequest.spotId,
					rank: updateRequest.rank,
				});
				await this.ranksRepository.save(ranksRequestDto);
			}
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}
}
