import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from '../users/entities/user.entity';

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;

  const mockUser: User = {
    id: 'user-id-1',
    name: 'Test User',
    email: 'test@test.com',
    password: 'password',
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
  };

  const mockPost = {
    id: 'post-id-1',
    title: 'Test Title',
    content: 'Test Content',
    user: mockUser,
    comments: [],
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
  };

  const mockPostsService = {
    create: jest.fn().mockResolvedValue(mockPost),
    findAll: jest.fn().mockResolvedValue([mockPost]),
    findOne: jest.fn().mockResolvedValue(mockPost),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: mockPostsService,
        },
      ],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call postsService.create', async () => {
      const dto: CreatePostDto = {
        title: 'Test Title',
        content: 'Test Content',
      };
      const req = { user: mockUser };
      const result = await controller.create(dto, req);
      expect(service.create).toHaveBeenCalledWith(dto, req.user);
      expect(result).toEqual(mockPost);
    });
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockPost]);
    });
  });

  describe('findOne', () => {
    it('should return a single post', async () => {
      const result = await controller.findOne('post-id-1');
      expect(service.findOne).toHaveBeenCalledWith('post-id-1');
      expect(result).toEqual(mockPost);
    });
  });
});
