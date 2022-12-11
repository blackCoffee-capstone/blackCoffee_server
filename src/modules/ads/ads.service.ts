import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Ad } from 'src/entities/ad.entity';
import { Location } from 'src/entities/locations.entity';
import { GetAdFilterRequestDto } from './dto/get-ad-filter-request.dto';
import { GetAdFilterResponseDto } from './dto/get-ad-filter-response.dto';

@Injectable()
export class AdsService {
	constructor(
		@InjectRepository(Ad)
		private readonly adsRepository: Repository<Ad>,
		@InjectRepository(Location)
		private readonly locationsRepository: Repository<Location>,
	) {}

	async getAdsFilter(getAdRequest?: GetAdFilterRequestDto) {
		try {
			const ads = this.adsRepository.createQueryBuilder('ad');
			if (getAdRequest.locationIds && getAdRequest.locationIds[0] !== 0) {
				let locationIds = getAdRequest.locationIds;
				const allSelection = await this.allSelection(locationIds);
				const localsIds = allSelection.flatMap(({ id }) => [id]);
				locationIds = [...new Set(locationIds.concat(localsIds))];

				ads.where('ad.locationId IN (:...ids)', { ids: locationIds });
			}
			const finalAds = await ads.orderBy('RANDOM()').limit(5).getMany();

			return finalAds.map((ad) => new GetAdFilterResponseDto(ad));
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	async clickAds(adId: number): Promise<boolean> {
		const ad = await this.adsRepository.createQueryBuilder('ad').where('ad.id = :adId', { adId }).getOne();
		if (!ad) throw new NotFoundException('Ad is not found');

		await this.adsRepository.update(adId, {
			click: () => 'click + 1',
		});

		return true;
	}

	private async allSelection(locationIds) {
		return await this.locationsRepository
			.createQueryBuilder('location')
			.leftJoinAndSelect('location.ads', 'ads')
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
			.andWhere('ads.id is not null')
			.distinctOn(['location.id'])
			.getRawMany();
	}
}
