import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LikePost } from 'src/entities/like-posts.entity';
import { Post } from 'src/entities/posts.entity';
import { User } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import { LocationResponseDto } from '../filters/dto/location-response.dto';
import { CommentsUserResponseDto } from '../users/dto/comments-user-response.dto';
import { UserMyPageRequestDto } from '../users/dto/user-mypage-request.dto';
import { UserLikesResponseDto } from './dto/user-likes-response.dto';
import { UserLikesDto } from './dto/user-likes.dto';

@Injectable()
export class LikesService {
	constructor(
		@InjectRepository(Post)
		private readonly postsRepository: Repository<Post>,
		@InjectRepository(LikePost)
		private readonly likePostsRepository: Repository<LikePost>,
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
	) {}

	async likePost(userId: number, postId: number, isLike: boolean): Promise<boolean> {
		const foundPost = await this.getPostUserId(postId);
		if (!foundPost) throw new NotFoundException('Post is not found');

		const isLikePost = await this.likePostsRepository
			.createQueryBuilder('likePost')
			.where('likePost.userId = :userId', { userId })
			.andWhere('likePost.postId = :postId', { postId })
			.getOne();

		if (isLike && isLikePost) throw new BadRequestException('User already likes post');
		else if (!isLike && !isLikePost) throw new BadRequestException('User already no likes post');
		else if (isLike && !isLikePost) {
			const likePost = this.likePostsRepository.create({
				userId,
				postId,
			});
			await this.likePostsRepository.save(likePost);
		} else if (!isLike && isLikePost) {
			await this.likePostsRepository.delete({
				userId,
				postId,
			});
		}
		return true;
	}

	async getUsersLikes(userId: number, likePageData: UserMyPageRequestDto): Promise<UserLikesResponseDto> {
		try {
			const likes = this.likePostsRepository
				.createQueryBuilder('likePost')
				.leftJoinAndSelect('likePost.user', 'user')
				.leftJoinAndSelect('likePost.post', 'post')
				.leftJoinAndSelect('post.clickPosts', 'clickPosts')
				.leftJoinAndSelect('post.likePosts', 'likePosts')
				.leftJoinAndSelect('post.location', 'location')
				.where('user.id = :userId', { userId })
				.orderBy('likePost.createdAt', 'DESC');

			const totalPageLikes = await likes.getMany();
			const responseLikes = await likes
				.take(likePageData.take)
				.skip((likePageData.page - 1) * likePageData.take)
				.getMany();

			const totalPage = Math.ceil(totalPageLikes.length / likePageData.take);
			const likesDto = [];
			for (const like of responseLikes) {
				const postsUser = await this.usersRepository
					.createQueryBuilder('user')
					.where('user.id = :postUserId', { postUserId: like.post.userId })
					.getOne();

				likesDto.push(
					new UserLikesDto({
						id: like.post.id,
						title: like.post.title,
						address: like.post.address,
						createdAt: like.post.createdAt,
						views: like.post.clickPosts.length,
						likes: like.post.likePosts.length,
						photoUrls: like.post.photoUrls,
						isLike: true,
						user: new CommentsUserResponseDto(postsUser),
						location: new LocationResponseDto(like.post.location),
					}),
				);
			}

			return new UserLikesResponseDto({
				totalPage: totalPage,
				totalLikePosts: totalPageLikes.length,
				likePosts: likesDto,
			});
		} catch (error) {
			throw new InternalServerErrorException(error.message, error);
		}
	}

	private async getPostUserId(postId: number) {
		return await this.postsRepository
			.createQueryBuilder('post')
			.leftJoinAndSelect('post.user', 'user')
			.leftJoinAndSelect('post.location', 'location')
			.leftJoinAndSelect('post.clickPosts', 'clickPosts')
			.leftJoinAndSelect('post.likePosts', 'likePosts')
			.where('post.id = :postId', { postId })
			.getOne();
	}
}
