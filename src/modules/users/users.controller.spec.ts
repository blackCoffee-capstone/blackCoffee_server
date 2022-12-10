import {
	BadRequestException,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { hash } from 'bcryptjs';

import { LikePost } from 'src/entities/like-posts.entity';
import { Post } from 'src/entities/posts.entity';
import { TasteTheme } from 'src/entities/taste-themes.entity';
import { Theme } from 'src/entities/theme.entity';
import { User } from 'src/entities/users.entity';
import { WishSpot } from 'src/entities/wish-spots.entity';
import { UserType } from 'src/types/users.types';
import { MockLikePostsRepository } from 'test/mock/like-posts.mock';
import { MockPostsRepository } from 'test/mock/posts.mock';
import { MockTasteThemesRepository } from 'test/mock/taste-themes.mock';
import { MockThemeRepository } from 'test/mock/theme.mock';
import { MockUsersRepository } from 'test/mock/users.mock';
import { MockWishSpotsRepository } from 'test/mock/wish-spots.mock';
import { HashPassword } from '../auth/hash-password';
import { UserLikesDto } from '../likes/dto/user-likes.dto';
import { UsersTasteThemesResponseDto } from '../taste-themes/dto/users-taste-themes-response.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
	let usersController: UsersController;
	let usersRepository: MockUsersRepository;
	let tasteThemesRepository: MockTasteThemesRepository;
	let themesRepository: MockThemeRepository;
	let postsRepository: MockPostsRepository;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UsersController],
			providers: [
				UsersService,
				HashPassword,
				{
					provide: getRepositoryToken(User),
					useClass: MockUsersRepository,
				},
				{
					provide: getRepositoryToken(TasteTheme),
					useClass: MockTasteThemesRepository,
				},
				{
					provide: getRepositoryToken(Theme),
					useClass: MockThemeRepository,
				},
				{
					provide: getRepositoryToken(WishSpot),
					useClass: MockWishSpotsRepository,
				},
				{
					provide: getRepositoryToken(LikePost),
					useClass: MockLikePostsRepository,
				},
				{
					provide: getRepositoryToken(Post),
					useClass: MockPostsRepository,
				},
			],
		}).compile();

		usersController = module.get<UsersController>(UsersController);
		usersRepository = module.get(getRepositoryToken(User));
		tasteThemesRepository = module.get(getRepositoryToken(TasteTheme));
		themesRepository = module.get(getRepositoryToken(Theme));
		postsRepository = module.get(getRepositoryToken(Post));
	});

	it('should be defined', () => {
		expect(usersController).toBeDefined();
	});
	describe('getUser()', () => {
		it('사용자 정보를 반환한다.', async () => {
			const user = await usersRepository.find();
			const userDto = new UserResponseDto(user);
			usersRepository.save.mockResolvedValue(user);
			usersRepository.findOne.mockResolvedValue(user);

			await expect(
				usersController.getUser({
					id: 1,
					role: UserType.Normal,
				}),
			).resolves.toEqual(userDto);
		});
		it('사용자를 찾을 수 없다면 에러를 반환한다.', async () => {
			usersRepository.save.mockResolvedValue(await usersRepository.find());

			await expect(
				usersController.getUser({
					id: 2,
					role: UserType.Normal,
				}),
			).rejects.toThrow(InternalServerErrorException);
		});
	});
	describe('updateUser()', () => {
		it('사용자 정보를 업데이트한다.', async () => {
			const user = await usersRepository.find();
			usersRepository.save.mockResolvedValue(user);
			usersRepository.createQueryBuilder().getOne.mockResolvedValue(null);

			await expect(
				usersController.updateUser(
					{
						id: 1,
						role: UserType.Normal,
					},
					{
						name: 'testupdate',
						nickname: 'testupdate',
					},
				),
			).resolves.toEqual(true);
		});
		it('업데이트할 값이 없다면 BadRequestException 에러를 반환한다.', async () => {
			usersRepository.save.mockResolvedValue(await usersRepository.find());

			await expect(
				usersController.updateUser(
					{
						id: 2,
						role: UserType.Normal,
					},
					{},
				),
			).rejects.toThrow(BadRequestException);
		});
		it('수정할 닉네임이 중복된다면 BadRequestException 에러를 반환한다.', async () => {
			const user = await usersRepository.find();
			usersRepository.save.mockResolvedValue(user);
			usersRepository.createQueryBuilder().getOne.mockResolvedValue(user);

			await expect(
				usersController.updateUser(
					{
						id: 2,
						role: UserType.Normal,
					},
					{
						name: 'testupdate',
						nickname: 'testupdate',
					},
				),
			).rejects.toThrow(BadRequestException);
		});
		it('수정할 name이 유효하지 않다면 BadRequestException 에러를 반환한다.', async () => {
			const user = await usersRepository.find();
			usersRepository.save.mockResolvedValue(user);
			usersRepository.createQueryBuilder().getOne.mockResolvedValue(user);

			await expect(
				usersController.updateUser(
					{
						id: 2,
						role: UserType.Normal,
					},
					{
						name: 'testupdate',
						nickname: 'te',
					},
				),
			).rejects.toThrow(BadRequestException);
		});
	});
	describe('createUsersTasteThemes()', () => {
		it('사용자의 테마 취향을 저장한다.', async () => {
			const themes = await themesRepository.find();
			const tasteThemes = await tasteThemesRepository.find();
			tasteThemesRepository.findOne.mockResolvedValue(null);
			themesRepository.createQueryBuilder().getMany.mockResolvedValue(themes);
			tasteThemesRepository.createQueryBuilder().execute(tasteThemes);
			usersRepository.update.mockResolvedValue(null);

			await expect(
				usersController.createUsersTasteThemes(
					{
						id: 1,
						role: UserType.Normal,
					},
					{
						tasteThemes: [1, 2, 3, 4, 5],
					},
				),
			).resolves.toEqual(true);
		});
		it('테마를 찾을 수 없다면 NotFoundException 에러를 반환한다.', async () => {
			const tasteThemes = await tasteThemesRepository.find();
			tasteThemesRepository.findOne.mockResolvedValue(null);
			themesRepository.createQueryBuilder().getMany.mockResolvedValue([]);
			tasteThemesRepository.createQueryBuilder().execute.mockResolvedValue(tasteThemes);

			await expect(
				usersController.createUsersTasteThemes(
					{
						id: 1,
						role: UserType.Normal,
					},
					{
						tasteThemes: [1, 2, 3, 4, 6],
					},
				),
			).rejects.toThrow(NotFoundException);
		});
		it('테마 취향 리스트가 중복된다면 BadRequestException 에러를 반환한다.', async () => {
			const themes = await themesRepository.find();
			const tasteThemes = await tasteThemesRepository.find();
			tasteThemesRepository.findOne.mockResolvedValue(null);
			themesRepository.createQueryBuilder().getMany.mockResolvedValue(themes);
			tasteThemesRepository.createQueryBuilder().execute.mockResolvedValue(tasteThemes);

			await expect(
				usersController.createUsersTasteThemes(
					{
						id: 1,
						role: UserType.Normal,
					},
					{
						tasteThemes: [1, 2, 3, 4, 4],
					},
				),
			).rejects.toThrow(BadRequestException);
		});
		it('사용자가 테마취향을 이미 선택했다면 BadRequestException 에러를 반환한다.', async () => {
			const themes = await themesRepository.find();
			const tasteThemes = await tasteThemesRepository.find();
			tasteThemesRepository.findOne.mockResolvedValue(tasteThemes);
			themesRepository.createQueryBuilder().getMany.mockResolvedValue(themes);
			tasteThemesRepository.createQueryBuilder().execute.mockResolvedValue(tasteThemes);

			await expect(
				usersController.createUsersTasteThemes(
					{
						id: 1,
						role: UserType.Normal,
					},
					{
						tasteThemes: [1, 2, 3, 4, 5],
					},
				),
			).rejects.toThrow(BadRequestException);
		});
	});
	describe('getUsersTasteThemes()', () => {
		it('사용자의 테마 취향을 반환한다.', async () => {
			const tasteThemes = await tasteThemesRepository.find();
			const expectTasteThemes = tasteThemes.map((item) => new UsersTasteThemesResponseDto(item));
			tasteThemesRepository.createQueryBuilder().getRawMany.mockResolvedValue(expectTasteThemes);

			await expect(
				usersController.getUsersTasteThemes({
					id: 1,
					role: UserType.Normal,
				}),
			).resolves.toEqual(expectTasteThemes);
		});
	});
	describe('updateUsersPw()', () => {
		it('사용자의 비밀번호를 변경한다.', async () => {
			const user = await usersRepository.find();
			usersRepository.createQueryBuilder().getOne.mockResolvedValue(user);
			usersRepository.update.mockResolvedValue(user);

			const saltOrRounds = 10;
			user.password = await hash('1234abcd!', saltOrRounds);

			await expect(
				usersController.updateUsersPw(
					{
						id: 1,
						role: UserType.Normal,
					},
					{ originPw: '1234abcd!', newPw: '1234abcd!!' },
				),
			).resolves.toEqual(true);
		});
		it('사용자가 카카오 사용자라면 BadRequestException 에러를 반환한다.', async () => {
			const user = await usersRepository.find();
			usersRepository.createQueryBuilder().getOne.mockResolvedValue(user);
			usersRepository.update.mockResolvedValue(user);

			const saltOrRounds = 10;
			user.password = await hash('1234abcd!', saltOrRounds);

			await expect(
				usersController.updateUsersPw(
					{
						id: 1,
						role: UserType.Kakao,
					},
					{ originPw: '1234abcd!', newPw: '1234abcd!!' },
				),
			).rejects.toThrow(BadRequestException);
		});
		it('사용자가 페이스북 사용자라면 BadRequestException 에러를 반환한다.', async () => {
			const user = await usersRepository.find();
			usersRepository.createQueryBuilder().getOne.mockResolvedValue(user);
			usersRepository.update.mockResolvedValue(user);

			const saltOrRounds = 10;
			user.password = await hash('1234abcd!', saltOrRounds);

			await expect(
				usersController.updateUsersPw(
					{
						id: 1,
						role: UserType.Facebook,
					},
					{ originPw: '1234abcd!', newPw: '1234abcd!!' },
				),
			).rejects.toThrow(BadRequestException);
		});
		it('기존 비밀번호와 새 비밀번호가 같다면 BadRequestException 에러를 반환한다.', async () => {
			const user = await usersRepository.find();
			usersRepository.createQueryBuilder().getOne.mockResolvedValue(user);
			usersRepository.update.mockResolvedValue(user);

			const saltOrRounds = 10;
			user.password = await hash('1234abcd!', saltOrRounds);

			await expect(
				usersController.updateUsersPw(
					{
						id: 1,
						role: UserType.Normal,
					},
					{ originPw: '1234abcd!', newPw: '1234abcd!' },
				),
			).rejects.toThrow(BadRequestException);
		});
		it('기존 비밀번호가 틀리다면 UnauthorizedException 에러를 반환한다.', async () => {
			const user = await usersRepository.find();
			usersRepository.createQueryBuilder().getOne.mockResolvedValue(user);
			usersRepository.update.mockResolvedValue(user);

			const saltOrRounds = 10;
			user.password = await hash('1234abcd!!!', saltOrRounds);

			await expect(
				usersController.updateUsersPw(
					{
						id: 1,
						role: UserType.Normal,
					},
					{ originPw: '1234abcd!', newPw: '1234abcd!!' },
				),
			).rejects.toThrow(UnauthorizedException);
		});
	});
	describe('getUsersPosts()', () => {
		it('사용자의 게시글 목록을 반환한다.', async () => {
			const user = await usersRepository.find();
			const posts = await postsRepository.find();
			const expectPosts = posts.map((item) => new UserLikesDto(item));
			usersRepository.createQueryBuilder().getOne.mockResolvedValue(user);
			postsRepository.createQueryBuilder().getMany.mockResolvedValue([
				{
					id: 1,
					title: 'test',
					address: '부산 해운대구',
					createdAt: '2022-12-06 23:07:57.787562+09',
					clickPosts: [1],
					likePosts: [{ userId: 1 }],
					photoUrls: ['test1', 'test2'],
					user: { id: 1, nickname: 'test' },
					location: { id: 1, metroName: '부산', localName: '해운대구' },
				},
			]);

			await expect(
				usersController.getUsersPosts(
					{
						id: 1,
						role: UserType.Normal,
					},
					{ page: 1, take: 10 },
				),
			).resolves.toEqual({
				totalPage: 1,
				totalPosts: 1,
				posts: expectPosts,
			});
		});
	});
});
