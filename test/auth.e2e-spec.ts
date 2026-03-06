import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const registerDto = {
    email: `test-${Date.now()}@example.com`,
    password: 'Password123!',
    name: 'E2E Test User',
  };

  it('/auth/register (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerDto)
      .expect(201);

    expect(response.body).toHaveProperty('access_token');
    expect(response.body.user.email).toBe(registerDto.email);
  });

  it('/auth/login (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: registerDto.email,
        password: registerDto.password,
      })
      .expect(200);

    expect(response.body).toHaveProperty('access_token');
    expect(response.body.user.email).toBe(registerDto.email);
  });

  it('/auth/login (POST) - failure', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: registerDto.email,
        password: 'wrongpassword',
      })
      .expect(401);
  });
});
