import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Rank } from 'src/entities/rank.entity';
import { Spot } from 'src/entities/spots.entity';
import { SnsPost } from 'src/entities/sns-posts.entity';
import { WishSpot } from 'src/entities/wish-spots.entity';
import { ClickSpot } from 'src/entities/click-spots.entity';
import { LocationResponseDto } from '../filters/dto/location-response.dto';
import { RankingListResponseDto } from './dto/ranking-list-response.dto';
import { RankingMapResponseDto } from './dto/ranking-map-response.dto';
import { RankingRequestDto } from './dto/ranking-request.dto';
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

	private async checkWeek(rankingRequest: RankingRequestDto) {
		const nextCheckWeek = await this.ranksRepository.createQueryBuilder('rank').orderBy('date', 'DESC').getOne();
		if (!nextCheckWeek) throw new NotFoundException('Rank is not found');
		if (rankingRequest.date > nextCheckWeek.date) throw new NotFoundException('Next is not found');

		const previousCheckWeek = await this.ranksRepository.createQueryBuilder('rank').orderBy('date', 'ASC').getOne();
		if (rankingRequest.date < previousCheckWeek.date) throw new NotFoundException('Previous is not found');
	}

	private async beforeWeek(rankingRequest: RankingRequestDto) {
		let beforeDate = rankingRequest.date - 1;
		if ((rankingRequest.date - 1) / 10) {
			const beforeCheckWeek = await this.ranksRepository
				.createQueryBuilder('rank')
				.select('date')
				.distinctOn(['date'])
				.orderBy('date', 'ASC')
				.getRawMany();

			const weekList = Array.from(beforeCheckWeek).flatMap(({ date }) => [date]);
			const dateIdx = weekList.lastIndexOf(rankingRequest.date);
			if (dateIdx === -1) throw new BadRequestException('Date is not exist');
			beforeDate = weekList[dateIdx - 1];
		}
		return beforeDate;
	}

	async getRanksList(rankingRequest: RankingRequestDto) {
		await this.checkWeek(rankingRequest);
		const beforeDate = await this.beforeWeek(rankingRequest);

		try {
			const rankingListSpots = await this.spotsRepository
				.createQueryBuilder('spot')
				.innerJoinAndSelect('spot.location', 'location')
				.innerJoinAndSelect('spot.rankings', 'rankings')
				.where('rankings.date = :date', { date: rankingRequest.date })
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
						.where('rankings.Date = :beforeDate', { beforeDate: beforeDate })
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

			return Array.from(rankingListSpots).map(function (spot) {
				let variance = null;
				if (spot.before_rank) variance = spot.before_rank - spot.after_rank;
				return new RankingListResponseDto({
					...spot,
					rank: spot.after_rank,
					variance: variance,
					views: +spot.clicks,
					wishes: +spot.wishes,
					photoUrl: spot.photo,
				});
			});
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	async getRanksMap(rankingRequest: RankingRequestDto) {
		await this.checkWeek(rankingRequest);
		await this.beforeWeek(rankingRequest);

		try {
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

			return Array.from(rankingMapSpots).map(
				(spot) =>
					new RankingMapResponseDto({
						...spot,
						rank: spot.current_rank,
					}),
			);
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
			if (!rank) {
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
