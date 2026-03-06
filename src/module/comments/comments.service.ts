import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment as CommentEntity } from './entities/comment.entity';
import { User } from '../users/entities/user.entity';
import { Post as PostEntity } from '../posts/entities/post.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    user: User,
  ): Promise<CommentEntity> {
    const newComment = this.commentRepository.create({
      content: createCommentDto.content,
      post: { id: createCommentDto.postId } as PostEntity,
      user,
    });
    return this.commentRepository.save(newComment);
  }

  async findAllByPost(postId: string): Promise<CommentEntity[]> {
    return this.commentRepository.find({
      where: { post: { id: postId } },
      relations: ['user'],
      order: { created_at: 'ASC' },
    });
  }

  async findOne(id: string): Promise<CommentEntity> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['user', 'post'],
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID "${id}" not found`);
    }
    return comment;
  }
}
