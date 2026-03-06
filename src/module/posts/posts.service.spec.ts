import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post as PostEntity } from './entities/post.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { NotFoundException } from '@nestjs/common';

describe('PostsService', () => {
  let service: PostsService;
  let repo: Repository<PostEntity>;

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

  const mockPostRepository = {
    create: jest.fn().mockReturnValue(mockPost),
    save: jest.fn().mockResolvedValue(mockPost),
    find: jest.fn().mockResolvedValue([mockPost]),
    findOne: jest.fn().mockResolvedValue(mockPost),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(PostEntity),
          useValue: mockPostRepository,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    repo = module.get<Repository<PostEntity>>(getRepositoryToken(PostEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new post', async () => {
      const createPostDto: CreatePostDto = {
        title: 'Test Title',
        content: 'Test Content',
      };
      const result = await service.create(createPostDto, mockUser);
      expect(repo.create).toHaveBeenCalledWith({
        ...createPostDto,
        user: mockUser,
      });
      expect(repo.save).toHaveBeenCalledWith(mockPost);
      expect(result).toEqual(mockPost);
    });
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      const result = await service.findAll();
      expect(repo.find).toHaveBeenCalledWith({
        relations: ['user', 'comments'],
        order: { created_at: 'DESC' },
      });
      expect(result).toEqual([mockPost]);
    });
  });

  describe('findOne', () => {
    it('should return a single post by id', async () => {
      const result = await service.findOne('post-id-1');
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { id: 'post-id-1' },
        relations: ['user', 'comments', 'comments.user'],
      });
      expect(result).toEqual(mockPost);
    });

    it('should throw NotFoundException if post is not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null);
      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
