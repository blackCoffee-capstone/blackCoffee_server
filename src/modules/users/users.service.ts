import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LikePost } from 'src/entities/like-posts.entity';
import { Post } from 'src/entities/posts.entity';
import { TasteTheme } from 'src/entities/taste-themes.entity';
import { Theme } from 'src/entities/theme.entity';
import { User } from 'src/entities/users.entity';
import { WishSpot } from 'src/entities/wish-spots.entity';
import { UserType } from 'src/types/users.types';
import { HashPassword } from '../auth/hash-password';
import { LocationResponseDto } from '../filters/dto/location-response.dto';
import { UserLikesDto } from '../likes/dto/user-likes.dto';
import { UsersTasteThemesResponseDto } from '../taste-themes/dto/users-taste-themes-response.dto';
import { ChangePwRequestDto } from './dto/change-pw-request.dto';
import { CommentsUserResponseDto } from './dto/comments-user-response.dto';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';
import { UserMyPageRequestDto } from './dto/user-mypage-request.dto';
import { UserPostsResponseDto } from './dto/user-posts-response.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
		@InjectRepository(TasteTheme)
		private readonly tasteThemesRepository: Repository<TasteTheme>,
		@InjectRepository(Theme)
		private readonly themesRepository: Repository<Theme>,
		@InjectRepository(WishSpot)
		private readonly wishSpotsRepository: Repository<WishSpot>,
		@InjectRepository(LikePost)
		private readonly likePostsRepository: Repository<LikePost>,
		@InjectRepository(Post)
		private readonly postsRepository: Repository<Post>,
		private hashPassword: HashPassword,
	) {}

	async getUser(userId: number): Promise<UserResponseDto> {
		try {
			const user = await this.usersRepository.findOne({
				where: { id: userId },
			});
			return new UserResponseDto(user);
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	async updateUser(userId: number, updateUserData: UpdateUserRequestDto): Promise<boolean> {
		if (!updateUserData.name && !updateUserData.nickname) {
			throw new BadRequestException(`Name and nickname is null`);
		}
		if (updateUserData.nickname && this.nickNameFormat(updateUserData.nickname)) {
			await this.errIfDuplicateNickname(updateUserData.nickname);
		}
		if (updateUserData.name) {
			this.nameFormat(updateUserData.name);
		}
		try {
			await this.usersRepository.update(userId, updateUserData);
			return true;
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	async createUsersTasteThemes(userId: number, tasteThemes: number[]): Promise<boolean> {
		const isUsersTasteThemes = await this.tasteThemesRepository.findOne({
			where: { userId },
		});
		if (this.isDuplicateArr(tasteThemes)) {
			throw new BadRequestException(`Duplicate value exists in user's taste list`);
		}
		if (isUsersTasteThemes) {
			throw new BadRequestException(`User's taste is already exist`);
		}
		if (await this.notFoundThemes(tasteThemes)) {
			throw new NotFoundException('Theme is not found');
		}
		try {
			const usersTasteThemes = [];
			for (let i = 0; i < tasteThemes.length; i++) {
				usersTasteThemes.push({
					userId: userId,
					themeId: tasteThemes[i],
				});
			}

			await this.tasteThemesRepository
				.createQueryBuilder('taste_theme')
				.insert()
				.into(TasteTheme)
				.values(usersTasteThemes)
				.execute();

			await this.updateUserIfNewUser(userId);

			return true;
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	async getUsersTasteThemes(userId: number): Promise<UsersTasteThemesResponseDto[]> {
		try {
			//taste
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

	async updateUsersPw(user, changePwDto: ChangePwRequestDto): Promise<boolean> {
		await this.errIfUpdatePwReqIsBad(user, changePwDto);

		const foundUser = await this.usersRepository
			.createQueryBuilder('user')
			.where('user.id = :id', { id: user.id })
			.getOne();

		if (!(await this.isValidPassword(foundUser.password, changePwDto.originPw))) {
			throw new UnauthorizedException('Password is incorrect');
		}
		if (this.pwCheck(changePwDto.newPw)) {
			foundUser.password = await this.hashPassword.hash(changePwDto.newPw);
			await this.usersRepository.update(user.id, foundUser);
		}
		return true;
	}

	async getUsersPosts(userId: number, usersPostPageData: UserMyPageRequestDto): Promise<UserPostsResponseDto> {
		try {
			const posts = this.postsRepository
				.createQueryBuilder('post')
				.leftJoinAndSelect('post.user', 'user')
				.leftJoinAndSelect('post.location', 'location')
				.leftJoinAndSelect('post.clickPosts', 'clickPosts')
				.leftJoinAndSelect('post.likePosts', 'likePosts')
				.where('user.id = :userId', { userId })
				.orderBy('post.created_at', 'DESC');

			const totalPagePosts = await posts.getMany();
			const responsePosts = await posts
				.limit(usersPostPageData.take)
				.offset((usersPostPageData.page - 1) * usersPostPageData.take)
				.getMany();

			const totalPage = Math.ceil(totalPagePosts.length / usersPostPageData.take);
			const postsDto = Array.from(responsePosts).map(
				(post) =>
					new UserLikesDto({
						id: post.id,
						title: post.title,
						address: post.address,
						createdAt: post.createdAt,
						views: post.clickPosts.length,
						likes: post.likePosts.length,
						photoUrls: post.photoUrls,
						isLike: this.isLikePost(userId, post.likePosts) ? true : false,
						user: new CommentsUserResponseDto(post.user),
						location: new LocationResponseDto(post.location),
					}),
			);

			return new UserPostsResponseDto({
				totalPage: totalPage,
				totalPosts: totalPagePosts.length,
				posts: postsDto,
			});
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	private isDuplicateArr(arr: any): boolean {
		const set = new Set(arr);

		if (arr.length !== set.size) return true;
		return false;
	}
	private async notFoundThemes(themes: number[]): Promise<boolean> {
		const foundThemes = await this.themesRepository
			.createQueryBuilder('theme')
			.where('theme.id IN (:...themeIds)', { themeIds: themes })
			.getMany();

		if (foundThemes.length !== themes.length) return true;
		return false;
	}

	private async errIfUpdatePwReqIsBad(user, changePwDto: ChangePwRequestDto) {
		if (user.role === UserType.Kakao) {
			throw new BadRequestException('User is kakao user');
		} else if (user.role === UserType.Facebook) {
			throw new BadRequestException('User is facebook user');
		} else if (changePwDto.originPw === changePwDto.newPw) {
			throw new BadRequestException('originPw and newPw are the same');
		}
	}

	private async isValidPassword(original: string, target: string) {
		return await this.hashPassword.equal({ password: target, hashPassword: original });
	}

	private async updateUserIfNewUser(userId: number) {
		await this.usersRepository.update(userId, {
			isNewUser: false,
		});
		return true;
	}

	private isLikePost(userId: number, likePosts: LikePost[]): boolean {
		const isLike = likePosts.find((x) => x.userId === userId);

		if (isLike) return true;
		return false;
	}

	private async errIfDuplicateNickname(nickname: string) {
		const foundNicknameUser = await this.usersRepository
			.createQueryBuilder('user')
			.where('user.nickname = :nickname', { nickname })
			.getOne();

		if (foundNicknameUser) {
			throw new BadRequestException('Nickname is already exist');
		} else return true;
	}

	private pwCheck(newPW: string): boolean {
		// 8~15자리 사이 숫자, 특수문자, 영어 1개 이상씩
		if (newPW.length > 15 || newPW.length < 8) throw new BadRequestException('Password is not valid');
		const reg_pw = /(?=.*\d)(?=.*[a-zA-Z])(?=.*[?!@#$%^&*()+=_-]).{8,15}/;
		const pass = reg_pw.test(newPW);
		if (pass) return true;
		else throw new BadRequestException('Password is not valid');
	}

	private nickNameFormat(nickname: string): boolean {
		// 4byte 이상, 18자 이하
		const regex_nick = /^[가-힣a-zA-Z0-9~!?@#$%^&*+=()[\]/'",.<>:;_-]+$/;
		// 4byte 이상, 18자 이하
		if (this.getByte(nickname) >= 4 && nickname.length <= 18 && regex_nick.test(nickname)) {
			return true;
		} else {
			throw new BadRequestException('Nickname is not valid');
		}
	}

	private nameFormat(name: string): boolean {
		const regex_name = /^[가-힣]{2,8}|[a-zA-Z]{2,16}$/;
		if (this.getByte(name) <= 16 && regex_name.test(name)) {
			return true;
		} else {
			throw new BadRequestException('Name is not valid');
		}
	}
	private getByte(str: string) {
		const strLength = str.length;
		let strByteLength = 0;
		for (let i = 0; i < strLength; i++) {
			if (escape(str.charAt(i)).length >= 4) strByteLength += 2;
			else if (escape(str.charAt(i)) == '%A7') strByteLength += 2;
			else if (escape(str.charAt(i)) != '%0D') strByteLength++;
		}
		return strByteLength;
	}
}
