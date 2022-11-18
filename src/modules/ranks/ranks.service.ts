import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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

	async checkWeek(rankingRequest: RankingRequestDto) {
		const nextCheckWeek = await this.ranksRepository.createQueryBuilder('rank').orderBy('date', 'DESC').getOne();
		if (!nextCheckWeek) throw new NotFoundException('Rank is not found');
		if (rankingRequest.date > nextCheckWeek.date) throw new NotFoundException('Next is not found');

		const previousCheckWeek = await this.ranksRepository.createQueryBuilder('rank').orderBy('date', 'ASC').getOne();
		if (rankingRequest.date < previousCheckWeek.date) throw new NotFoundException('Previous is not found');
	}

	async beforeWeek(rankingRequest: RankingRequestDto) {
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
				.select('spot.id AS id, spot.name AS name')
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
				.getRawMany();

			return Array.from(rankingListSpots).map(function (post) {
				let variance = null;
				if (post.before_rank) variance = post.before_rank - post.after_rank;
				return new RankingListResponseDto({
					...post,
					rank: post.after_rank,
					variance: variance,
					location: new LocationResponseDto({
						id: post.location_id,
						metroName: post.metro,
						localName: post.local,
					}),
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
