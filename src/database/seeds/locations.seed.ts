import { Factory, Seeder } from 'typeorm-seeding';

import { Location } from 'src/entities/locations.entity';
import { Connection } from 'typeorm';

const seedLocationDatas = [
	{
		metroName: '서울',
		localName: null,
	},
	{
		metroName: '인천',
		localName: null,
	},
	{
		metroName: '부산',
		localName: null,
	},
	{
		metroName: '대구',
		localName: null,
	},
	{
		metroName: '대전',
		localName: null,
	},
	{
		metroName: '광주',
		localName: null,
	},
	{
		metroName: '울산',
		localName: null,
	},
	{
		metroName: '세종',
		localName: null,
	},
	{
		metroName: '경기도',
		localName: '고양시',
	},
	{
		metroName: '경기도',
		localName: '과천시',
	},
	{
		metroName: '경기도',
		localName: '광명시',
	},
	{
		metroName: '경기도',
		localName: '광주시',
	},
	{
		metroName: '경기도',
		localName: '구리시',
	},
	{
		metroName: '경기도',
		localName: '군포시',
	},
	{
		metroName: '경기도',
		localName: '김포시',
	},
	{
		metroName: '경기도',
		localName: '남양주시',
	},
	{
		metroName: '경기도',
		localName: '동두천시',
	},
	{
		metroName: '경기도',
		localName: '부천시',
	},
	{
		metroName: '경기도',
		localName: '성남시',
	},
	{
		metroName: '경기도',
		localName: '수원시',
	},
	{
		metroName: '경기도',
		localName: '시흥시',
	},
	{
		metroName: '경기도',
		localName: '안산시',
	},
	{
		metroName: '경기도',
		localName: '안성시',
	},
	{
		metroName: '경기도',
		localName: '안양시',
	},
	{
		metroName: '경기도',
		localName: '양주시',
	},
	{
		metroName: '경기도',
		localName: '오산시',
	},
	{
		metroName: '경기도',
		localName: '용인시',
	},
	{
		metroName: '경기도',
		localName: '의왕시',
	},
	{
		metroName: '경기도',
		localName: '의정부시',
	},
	{
		metroName: '경기도',
		localName: '이천시',
	},
	{
		metroName: '경기도',
		localName: '파주시',
	},
	{
		metroName: '경기도',
		localName: '평택시',
	},
	{
		metroName: '경기도',
		localName: '포천시',
	},
	{
		metroName: '경기도',
		localName: '하남시',
	},
	{
		metroName: '경기도',
		localName: '화성시',
	},
	{
		metroName: '경기도',
		localName: '연천군',
	},
	{
		metroName: '경기도',
		localName: '가평군',
	},
	{
		metroName: '경기도',
		localName: '양평군',
	},
	{
		metroName: '강원도',
		localName: '강릉시',
	},
	{
		metroName: '강원도',
		localName: '동해시',
	},
	{
		metroName: '강원도',
		localName: '삼척시',
	},
	{
		metroName: '강원도',
		localName: '속초시',
	},
	{
		metroName: '강원도',
		localName: '원주시',
	},
	{
		metroName: '강원도',
		localName: '춘천시',
	},
	{
		metroName: '강원도',
		localName: '태백시',
	},
	{
		metroName: '강원도',
		localName: '홍천군',
	},
	{
		metroName: '강원도',
		localName: '횡성군',
	},
	{
		metroName: '강원도',
		localName: '영월군',
	},
	{
		metroName: '강원도',
		localName: '평창군',
	},
	{
		metroName: '강원도',
		localName: '정선군',
	},
	{
		metroName: '강원도',
		localName: '철원군',
	},
	{
		metroName: '강원도',
		localName: '화천군',
	},
	{
		metroName: '강원도',
		localName: '양구군',
	},
	{
		metroName: '강원도',
		localName: '인제군',
	},
	{
		metroName: '강원도',
		localName: '고성군',
	},
	{
		metroName: '강원도',
		localName: '양양군',
	},
	{
		metroName: '충청도',
		localName: '제천시',
	},
	{
		metroName: '충청도',
		localName: '청주시',
	},
	{
		metroName: '충청도',
		localName: '충주시',
	},
	{
		metroName: '충청도',
		localName: '계룡시',
	},
	{
		metroName: '충청도',
		localName: '공주시',
	},
	{
		metroName: '충청도',
		localName: '논산시',
	},
	{
		metroName: '충청도',
		localName: '당진시',
	},
	{
		metroName: '충청도',
		localName: '보령시',
	},
	{
		metroName: '충청도',
		localName: '서산시',
	},
	{
		metroName: '충청도',
		localName: '아산시',
	},
	{
		metroName: '충청도',
		localName: '천안시',
	},
	{
		metroName: '충청도',
		localName: '보은군',
	},
	{
		metroName: '충청도',
		localName: '옥천군',
	},
	{
		metroName: '충청도',
		localName: '영동군',
	},
	{
		metroName: '충청도',
		localName: '중평군',
	},
	{
		metroName: '충청도',
		localName: '진천군',
	},
	{
		metroName: '충청도',
		localName: '괴산군',
	},
	{
		metroName: '충청도',
		localName: '음성군',
	},
	{
		metroName: '충청도',
		localName: '단양군',
	},
	{
		metroName: '충청도',
		localName: '금산군',
	},
	{
		metroName: '충청도',
		localName: '부여군',
	},
	{
		metroName: '충청도',
		localName: '서천군',
	},
	{
		metroName: '충청도',
		localName: '청양군',
	},
	{
		metroName: '충청도',
		localName: '홍성군',
	},
	{
		metroName: '충청도',
		localName: '예산군',
	},
	{
		metroName: '충청도',
		localName: '태안군',
	},
	{
		metroName: '경상도',
		localName: '경산시',
	},
	{
		metroName: '경상도',
		localName: '경주시',
	},
	{
		metroName: '경상도',
		localName: '구미시',
	},
	{
		metroName: '경상도',
		localName: '김천시',
	},
	{
		metroName: '경상도',
		localName: '문경시',
	},
	{
		metroName: '경상도',
		localName: '상주시',
	},
	{
		metroName: '경상도',
		localName: '안동시',
	},
	{
		metroName: '경상도',
		localName: '영주시',
	},
	{
		metroName: '경상도',
		localName: '영천시',
	},
	{
		metroName: '경상도',
		localName: '포항시',
	},
	{
		metroName: '경상도',
		localName: '거제시',
	},
	{
		metroName: '경상도',
		localName: '김해시',
	},
	{
		metroName: '경상도',
		localName: '밀양시',
	},
	{
		metroName: '경상도',
		localName: '사천시',
	},
	{
		metroName: '경상도',
		localName: '양산시',
	},
	{
		metroName: '경상도',
		localName: '진주시',
	},
	{
		metroName: '경상도',
		localName: '창원시',
	},
	{
		metroName: '경상도',
		localName: '통영시',
	},
	{
		metroName: '경상도',
		localName: '군위군',
	},
	{
		metroName: '경상도',
		localName: '의성군',
	},
	{
		metroName: '경상도',
		localName: '청송군',
	},
	{
		metroName: '경상도',
		localName: '영양군',
	},
	{
		metroName: '경상도',
		localName: '영덕군',
	},
	{
		metroName: '경상도',
		localName: '청도군',
	},
	{
		metroName: '경상도',
		localName: '고령군',
	},
	{
		metroName: '경상도',
		localName: '성주군',
	},
	{
		metroName: '경상도',
		localName: '칠곡군',
	},
	{
		metroName: '경상도',
		localName: '예천군',
	},
	{
		metroName: '경상도',
		localName: '봉화군',
	},
	{
		metroName: '경상도',
		localName: '울진군',
	},
	{
		metroName: '경상도',
		localName: '울릉군',
	},
	{
		metroName: '경상도',
		localName: '의령군',
	},
	{
		metroName: '경상도',
		localName: '함안군',
	},
	{
		metroName: '경상도',
		localName: '창녕군',
	},
	{
		metroName: '경상도',
		localName: '고성군',
	},
	{
		metroName: '경상도',
		localName: '남해군',
	},
	{
		metroName: '경상도',
		localName: '하동군',
	},
	{
		metroName: '경상도',
		localName: '산청군',
	},
	{
		metroName: '경상도',
		localName: '함양군',
	},
	{
		metroName: '경상도',
		localName: '거창군',
	},
	{
		metroName: '경상도',
		localName: '합천군',
	},
	{
		metroName: '전라도',
		localName: '군산시',
	},
	{
		metroName: '전라도',
		localName: '김제시',
	},
	{
		metroName: '전라도',
		localName: '낙원시',
	},
	{
		metroName: '전라도',
		localName: '익산시',
	},
	{
		metroName: '전라도',
		localName: '전주시',
	},
	{
		metroName: '전라도',
		localName: '정읍시',
	},
	{
		metroName: '전라도',
		localName: '광양시',
	},
	{
		metroName: '전라도',
		localName: '나주시',
	},
	{
		metroName: '전라도',
		localName: '목포시',
	},
	{
		metroName: '전라도',
		localName: '순천시',
	},
	{
		metroName: '전라도',
		localName: '여수시',
	},
	{
		metroName: '전라도',
		localName: '완주군',
	},
	{
		metroName: '전라도',
		localName: '진안군',
	},
	{
		metroName: '전라도',
		localName: '무주군',
	},
	{
		metroName: '전라도',
		localName: '장수군',
	},
	{
		metroName: '전라도',
		localName: '임실군',
	},
	{
		metroName: '전라도',
		localName: '순창군',
	},
	{
		metroName: '전라도',
		localName: '고창군',
	},
	{
		metroName: '전라도',
		localName: '부안군',
	},
	{
		metroName: '전라도',
		localName: '담양군',
	},
	{
		metroName: '전라도',
		localName: '곡성군',
	},
	{
		metroName: '전라도',
		localName: '구례군',
	},
	{
		metroName: '전라도',
		localName: '고흥군',
	},
	{
		metroName: '전라도',
		localName: '보성군',
	},
	{
		metroName: '전라도',
		localName: '화순군',
	},
	{
		metroName: '전라도',
		localName: '장흥군',
	},
	{
		metroName: '전라도',
		localName: '강진군',
	},
	{
		metroName: '전라도',
		localName: '해남군',
	},
	{
		metroName: '전라도',
		localName: '영암군',
	},
	{
		metroName: '전라도',
		localName: '무안군',
	},
	{
		metroName: '전라도',
		localName: '함평군',
	},
	{
		metroName: '전라도',
		localName: '영광군',
	},
	{
		metroName: '전라도',
		localName: '장성군',
	},
	{
		metroName: '전라도',
		localName: '완도군',
	},
	{
		metroName: '전라도',
		localName: '진도군',
	},
	{
		metroName: '전라도',
		localName: '신안군',
	},
];

export default class LocationsSeed implements Seeder {
	public async run(Factory: Factory, connection: Connection): Promise<void> {
		const currentLocations = await connection.getRepository(Location).createQueryBuilder().select().getMany();

		for (const location of seedLocationDatas) {
			const isLocationExist = currentLocations.find(
				(currentLocation) =>
					currentLocation.metroName === location.metroName &&
					currentLocation.localName === location.localName,
			);

			if (!isLocationExist) {
				await connection.getRepository(Location).save(location);
			}
		}
	}
}
