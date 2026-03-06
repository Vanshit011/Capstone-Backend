import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { Post as PostEntity } from './entities/post.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  async create(createPostDto: CreatePostDto, user: User): Promise<PostEntity> {
    const newPost = this.postRepository.create({
      ...createPostDto,
      user,
    });
    return this.postRepository.save(newPost);
  }

  async findAll(): Promise<PostEntity[]> {
    return this.postRepository.find({
      relations: ['user', 'comments'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<PostEntity> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user', 'comments', 'comments.user'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }
    return post;
  }
}
