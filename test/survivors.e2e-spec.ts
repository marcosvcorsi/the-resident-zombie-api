import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { HttpModule } from '@/infra/http/http.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Gender } from '@/domain/entities/survivor';
import { Item } from '@prisma/client';

describe('SurvivorsController (e2e)', () => {
  let prismaService: PrismaService;
  let app: INestApplication;

  let item: Item;

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
    await prismaService.report.deleteMany();
    await prismaService.survivor.deleteMany();

    item = await prismaService.item.create({
      data: {
        name: 'Item',
        points: 10,
      },
    });
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  describe('POST /survivors', () => {
    it('should create a new survivor', async () => {
      const payload = {
        name: 'any_name',
        age: 10,
        gender: Gender.MALE,
        latitude: 1,
        longitude: 1,
        inventoryItems: [
          {
            itemId: item.id,
            quantity: 1,
          },
        ],
      };

      const response = await request(app.getHttpServer())
        .post('/survivors')
        .send(payload);

      expect(response.statusCode).toBe(201);
      expect(response.body).toMatchObject({
        ...payload,
        inventoryItems: expect.arrayContaining([
          expect.objectContaining({
            item,
            quantity: 1,
          }),
        ]),
      });
    });
  });

  describe('PATCH /survivors/:id', () => {
    it('should update latitude and longitude for a existing survivor', async () => {
      const survivor = await prismaService.survivor.create({
        data: {
          name: 'any_name',
          age: 18,
          gender: Gender.MALE,
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
        gender: Gender.MALE,
        latitude: 1,
        longitude: 1,
        inventoryItems: {
          create: {
            itemId: item.id,
            quantity: 1,
          },
        },
      };

      const survivor = await prismaService.survivor.create({
        data,
      });

      const response = await request(app.getHttpServer()).get(
        `/survivors/${survivor.id}`,
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        ...data,
        inventoryItems: expect.arrayContaining([
          expect.objectContaining({
            item,
            quantity: 1,
          }),
        ]),
      });
    });
  });

  describe('GET /survivors', () => {
    it('should get survivors', async () => {
      const data = {
        name: 'any_name',
        age: 18,
        gender: Gender.MALE,
        latitude: 1,
        longitude: 1,
      };

      await prismaService.survivor.create({
        data,
      });

      const response = await request(app.getHttpServer()).get(`/survivors`);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        total: 1,
        data: [expect.objectContaining(data)],
      });
    });
  });

  describe('DELETE /survivors/:id', () => {
    it('should delete an existing survivor', async () => {
      const data = {
        name: 'any_name',
        age: 18,
        gender: Gender.MALE,
        latitude: 1,
        longitude: 1,
      };

      const survivor = await prismaService.survivor.create({
        data,
      });

      const response = await request(app.getHttpServer()).del(
        `/survivors/${survivor.id}`,
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject(data);
    });
  });

  describe('POST /survivors/:id/reports', () => {
    it('should create a new survivor report', async () => {
      const reporter = await prismaService.survivor.create({
        data: {
          name: 'any_name',
          age: 18,
          gender: Gender.MALE,
          latitude: 1,
          longitude: 1,
        },
      });

      const survivor = await prismaService.survivor.create({
        data: {
          name: 'any_name',
          age: 18,
          gender: Gender.MALE,
          latitude: 1,
          longitude: 1,
        },
      });

      const response = await request(app.getHttpServer())
        .post(`/survivors/${survivor.id}/reports`)
        .set('Authorization', reporter.id);

      expect(response.statusCode).toBe(201);
      expect(response.body).toMatchObject({
        id: expect.any(String),
        survivor: {
          id: survivor.id,
        },
        createdAt: expect.any(String),
      });
    });
  });

  describe('POST /survivors/:id/trades', () => {
    it('should trade items with max quantity', async () => {
      const requester = await prismaService.survivor.create({
        data: {
          name: 'any_name',
          age: 18,
          gender: Gender.MALE,
          latitude: 1,
          longitude: 1,
        },
      });

      const requesterItem = await prismaService.item.create({
        data: {
          name: 'any_item',
          points: 1,
        },
      });

      await prismaService.inventoryItem.create({
        data: {
          survivorId: requester.id,
          itemId: requesterItem.id,
          quantity: 1,
        },
      });

      const receiver = await prismaService.survivor.create({
        data: {
          name: 'any_name',
          age: 18,
          gender: Gender.MALE,
          latitude: 1,
          longitude: 1,
        },
      });

      const receiverItem = await prismaService.item.create({
        data: {
          name: 'other_item',
          points: 1,
        },
      });

      await prismaService.inventoryItem.create({
        data: {
          survivorId: receiver.id,
          itemId: receiverItem.id,
          quantity: 1,
        },
      });

      const response = await request(app.getHttpServer())
        .post(`/survivors/${receiver.id}/trades`)
        .send({
          requesterTradeItems: [
            {
              itemId: requesterItem.id,
              quantity: 1,
            },
          ],
          receiverTradeItems: [
            {
              itemId: receiverItem.id,
              quantity: 1,
            },
          ],
        })
        .set('Authorization', requester.id);

      expect(response.statusCode).toBe(201);
      expect(response.body.receiver).toMatchObject({
        inventoryItems: expect.arrayContaining([
          expect.objectContaining({
            item: requesterItem,
            quantity: 1,
          }),
        ]),
      });
      expect(response.body.requester).toMatchObject({
        inventoryItems: expect.arrayContaining([
          expect.objectContaining({
            item: receiverItem,
            quantity: 1,
          }),
        ]),
      });
    });

    it('should trade items with less quantity', async () => {
      const requester = await prismaService.survivor.create({
        data: {
          name: 'any_name',
          age: 18,
          gender: Gender.MALE,
          latitude: 1,
          longitude: 1,
        },
      });

      const requesterItem = await prismaService.item.create({
        data: {
          name: 'any_item',
          points: 1,
        },
      });

      await prismaService.inventoryItem.create({
        data: {
          survivorId: requester.id,
          itemId: requesterItem.id,
          quantity: 2,
        },
      });

      const receiver = await prismaService.survivor.create({
        data: {
          name: 'any_name',
          age: 18,
          gender: Gender.MALE,
          latitude: 1,
          longitude: 1,
        },
      });

      const receiverItem = await prismaService.item.create({
        data: {
          name: 'other_item',
          points: 1,
        },
      });

      await prismaService.inventoryItem.create({
        data: {
          survivorId: receiver.id,
          itemId: receiverItem.id,
          quantity: 2,
        },
      });

      const response = await request(app.getHttpServer())
        .post(`/survivors/${receiver.id}/trades`)
        .send({
          requesterTradeItems: [
            {
              itemId: requesterItem.id,
              quantity: 1,
            },
          ],
          receiverTradeItems: [
            {
              itemId: receiverItem.id,
              quantity: 1,
            },
          ],
        })
        .set('Authorization', requester.id);

      expect(response.statusCode).toBe(201);
      expect(response.body.receiver).toMatchObject({
        inventoryItems: expect.arrayContaining([
          expect.objectContaining({
            item: requesterItem,
            quantity: 1,
          }),
          expect.objectContaining({
            item: receiverItem,
            quantity: 1,
          }),
        ]),
      });
      expect(response.body.requester).toMatchObject({
        inventoryItems: expect.arrayContaining([
          expect.objectContaining({
            item: requesterItem,
            quantity: 1,
          }),
          expect.objectContaining({
            item: receiverItem,
            quantity: 1,
          }),
        ]),
      });
    });
  });
});
