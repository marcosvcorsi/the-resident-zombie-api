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

    await prismaService.inventoryItem.deleteMany();
    await prismaService.item.deleteMany();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  describe('GET /items', () => {
    it('should get all items paginated', async () => {
      const item = await prismaService.item.create({
        data: {
          name: 'Item',
          points: 10,
        },
      });

      const response = await request(app.getHttpServer()).get(`/items`);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        total: 1,
        data: [expect.objectContaining(item)],
      });
    });
  });
});
