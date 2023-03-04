import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { HttpModule } from '@/infra/http/http.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Gender } from '@prisma/client';

describe('DashboardController (e2e)', () => {
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
    await prismaService.survivor.deleteMany();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  describe('GET /dashboard', () => {
    it('should get dashboard data', async () => {
      const survivor = await prismaService.survivor.create({
        data: {
          age: 18,
          name: 'any_name',
          gender: Gender.MALE,
          latitude: 1,
          longitude: 1,
        },
      });

      const infectedSurvivor = await prismaService.survivor.create({
        data: {
          age: 18,
          name: 'any_name_2',
          gender: Gender.MALE,
          latitude: 1,
          longitude: 1,
          infectedAt: new Date(),
        },
      });

      const itemBottle = await prismaService.item.create({
        data: {
          name: 'any_bottle',
          points: 10,
        },
      });

      const itemAxe = await prismaService.item.create({
        data: {
          name: 'any_axe',
          points: 5,
        },
      });

      await prismaService.inventoryItem.create({
        data: {
          survivorId: survivor.id,
          itemId: itemBottle.id,
          quantity: 4,
        },
      });

      await prismaService.inventoryItem.create({
        data: {
          survivorId: infectedSurvivor.id,
          itemId: itemAxe.id,
          quantity: 2,
        },
      });

      const response = await request(app.getHttpServer()).get(`/dashboard`);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        infectedPercentage: 50,
        nonInfectedPercentage: 50,
        totalLostPoints: 10,
        resourcesAverage: expect.arrayContaining([
          expect.objectContaining({
            id: itemAxe.id,
            average: 1,
          }),
          expect.objectContaining({
            id: itemBottle.id,
            average: 2,
          }),
        ]),
      });
    });
  });
});
