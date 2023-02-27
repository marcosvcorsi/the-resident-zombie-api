import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { HttpModule } from '@/infra/http/http.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

describe('SurvivorsController (e2e)', () => {
  let prismaService: PrismaService;
  let app: INestApplication;

  beforeAll(async () => {
    prismaService = new PrismaService();

    await prismaService.$connect();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prismaService.survivor.deleteMany();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  describe('POST /survivors', () => {
    it('should create a new survivor', async () => {
      const payload = {
        name: 'any_name',
        age: 10,
        gender: 'male',
        latitude: 1,
        longitude: 1,
      };

      const response = await request(app.getHttpServer())
        .post('/survivors')
        .send(payload);

      expect(response.statusCode).toBe(201);
      expect(response.body).toMatchObject(payload);
    });
  });

  describe('PATCH /survivors/:id', () => {
    it('should update latitude and longitude for a existing survivor', async () => {
      const survivor = await prismaService.survivor.create({
        data: {
          name: 'any_name',
          age: 18,
          gender: 'male',
          latitude: 1,
          longitude: 1,
        },
      });

      const payload = {
        latitude: 2,
        longitude: 2,
      };

      const response = await request(app.getHttpServer())
        .patch(`/survivors/${survivor.id}`)
        .send(payload);

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject(payload);
    });
  });

  describe('GET /survivors/:id', () => {
    it('should get an existing survivor', async () => {
      const data = {
        name: 'any_name',
        age: 18,
        gender: 'male',
        latitude: 1,
        longitude: 1,
      };

      const survivor = await prismaService.survivor.create({
        data,
      });

      const response = await request(app.getHttpServer()).get(
        `/survivors/${survivor.id}`,
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject(data);
    });
  });
});
