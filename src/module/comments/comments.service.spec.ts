import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Comment as CommentEntity } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Post as PostEntity } from '../posts/entities/post.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { NotFoundException } from '@nestjs/common';

describe('CommentsService', () => {
  let service: CommentsService;
  let repo: Repository<CommentEntity>;

  const mockUser: User = {
    id: 'user-id-1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'password',
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
  };

  const mockPost: PostEntity = {
    id: 'post-id-1',
    title: 'Test Title',
    content: 'Test Content',
    user: mockUser,
    comments: [],
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
  };

  const mockComment: CommentEntity = {
    id: 'comment-id-1',
    content: 'Great post!',
    user: mockUser,
    post: mockPost,
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
  };

  const mockCommentRepository = {
    create: jest.fn().mockReturnValue(mockComment),
    save: jest.fn().mockResolvedValue(mockComment),
    find: jest.fn().mockResolvedValue([mockComment]),
    findOne: jest.fn().mockResolvedValue(mockComment),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: getRepositoryToken(CommentEntity),
          useValue: mockCommentRepository,
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    repo = module.get<Repository<CommentEntity>>(
      getRepositoryToken(CommentEntity),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new comment', async () => {
      const dto: CreateCommentDto = {
        content: 'Great post!',
        postId: 'post-id-1',
      };
      const result = await service.create(dto, mockUser);
      expect(repo.create).toHaveBeenCalledWith({
        content: dto.content,
        post: { id: dto.postId },
        user: mockUser,
      });
      expect(repo.save).toHaveBeenCalledWith(mockComment);
      expect(result).toEqual(mockComment);
    });
  });

  describe('findAllByPost', () => {
    it('should return an array of comments for a post', async () => {
      const result = await service.findAllByPost('post-id-1');
      expect(repo.find).toHaveBeenCalledWith({
        where: { post: { id: 'post-id-1' } },
        relations: ['user'],
        order: { created_at: 'ASC' },
      });
      expect(result).toEqual([mockComment]);
    });
  });

  describe('findOne', () => {
    it('should return a single comment by id', async () => {
      const result = await service.findOne('comment-id-1');
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { id: 'comment-id-1' },
        relations: ['user', 'post'],
      });
      expect(result).toEqual(mockComment);
    });

    it('should throw NotFoundException if comment is not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null);
      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
