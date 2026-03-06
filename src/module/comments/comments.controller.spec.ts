import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from '../users/entities/user.entity';

describe('CommentsController', () => {
  let controller: CommentsController;
  let service: CommentsService;

  const mockUser: User = {
    id: 'user-id-1',
    name: 'Test User',
    email: 'test@test.com',
    password: 'password',
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
  };

  const mockComment = {
    id: 'comment-id-1',
    content: 'Great post!',
    user: mockUser,
    post: { id: 'post-id-1' } as any,
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
  };

  const mockCommentsService = {
    create: jest.fn().mockResolvedValue(mockComment),
    findAllByPost: jest.fn().mockResolvedValue([mockComment]),
    findOne: jest.fn().mockResolvedValue(mockComment),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useValue: mockCommentsService,
        },
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
    service = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call commentsService.create', async () => {
      const dto: CreateCommentDto = {
        content: 'Great post!',
        postId: 'post-id-1',
      };
      const req = { user: mockUser };
      const result = await controller.create(dto, req);
      expect(service.create).toHaveBeenCalledWith(dto, req.user);
      expect(result).toEqual(mockComment);
    });
  });

  describe('findAllByPost', () => {
    it('should return comments for a post', async () => {
      const result = await controller.findAllByPost('post-id-1');
      expect(service.findAllByPost).toHaveBeenCalledWith('post-id-1');
      expect(result).toEqual([mockComment]);
    });
  });

  describe('findOne', () => {
    it('should return a single comment', async () => {
      const result = await controller.findOne('comment-id-1');
      expect(service.findOne).toHaveBeenCalledWith('comment-id-1');
      expect(result).toEqual(mockComment);
    });
  });
});
