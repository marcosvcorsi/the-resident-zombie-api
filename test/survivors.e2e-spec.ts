import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { HttpModule } from '../src/infra/http/http.module';

describe('SurvivorsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/survivors (POST)', () => {
    console.log(process.env.NODE_ENV, process.env.DATABASE_URL);

    return request(app.getHttpServer())
      .post('/survivors')
      .send({
        name: 'any_name',
        age: 10,
        gender: 'male',
        latitude: 1,
        longitude: 1,
      })
      .expect(201);
  });
});
