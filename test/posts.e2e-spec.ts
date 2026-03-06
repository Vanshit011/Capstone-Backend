import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PostsModule } from '../src/module/posts/posts.module';
import { PostsService } from '../src/module/posts/posts.service';
import { JwtAuthGuard } from '../src/module/auth/guards/jwt-auth.guard';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post as PostEntity } from '../src/module/posts/entities/post.entity';

describe('PostsController (e2e)', () => {
  let app: INestApplication;

  const mockPostsService = {
    create: jest
      .fn()
      .mockResolvedValue({ id: '1', title: 'Test', content: 'Content' }),
    findAll: jest
      .fn()
      .mockResolvedValue([{ id: '1', title: 'Test', content: 'Content' }]),
    findOne: jest
      .fn()
      .mockResolvedValue({ id: '1', title: 'Test', content: 'Content' }),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PostsModule],
    })
      .overrideProvider(PostsService)
      .useValue(mockPostsService)
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideProvider(getRepositoryToken(PostEntity))
      .useValue({})
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/posts (GET)', () => {
    return request(app.getHttpServer())
      .get('/posts')
      .expect(200)
      .expect([{ id: '1', title: 'Test', content: 'Content' }]);
  });

  it('/posts/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/posts/1')
      .expect(200)
      .expect({ id: '1', title: 'Test', content: 'Content' });
  });

  it('/posts (POST)', () => {
    return request(app.getHttpServer())
      .post('/posts')
      .send({ title: 'Test', content: 'Content' })
      .expect(201)
      .expect({ id: '1', title: 'Test', content: 'Content' });
  });
});
