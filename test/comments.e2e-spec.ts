import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { CommentsModule } from '../src/module/comments/comments.module';
import { CommentsService } from '../src/module/comments/comments.service';
import { JwtAuthGuard } from '../src/module/auth/guards/jwt-auth.guard';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Comment as CommentEntity } from '../src/module/comments/entities/comment.entity';

describe('CommentsController (e2e)', () => {
  let app: INestApplication;

  const mockCommentsService = {
    create: jest.fn().mockResolvedValue({ id: '1', content: 'Test comment' }),
    findAllByPost: jest
      .fn()
      .mockResolvedValue([{ id: '1', content: 'Test comment' }]),
    findOne: jest.fn().mockResolvedValue({ id: '1', content: 'Test comment' }),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CommentsModule],
    })
      .overrideProvider(CommentsService)
      .useValue(mockCommentsService)
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideProvider(getRepositoryToken(CommentEntity))
      .useValue({})
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/comments/post/:postId (GET)', () => {
    return request(app.getHttpServer())
      .get('/comments/post/1')
      .expect(200)
      .expect([{ id: '1', content: 'Test comment' }]);
  });

  it('/comments/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/comments/1')
      .expect(200)
      .expect({ id: '1', content: 'Test comment' });
  });

  it('/comments (POST)', () => {
    return request(app.getHttpServer())
      .post('/comments')
      .send({ content: 'Test comment', postId: 'post-id-1' })
      .expect(201)
      .expect({ id: '1', content: 'Test comment' });
  });
});
