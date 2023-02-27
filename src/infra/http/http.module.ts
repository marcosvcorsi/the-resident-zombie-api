import { GetSurvivorService } from '@/domain/services/get-survivor';
import { UpdateSurvivorService } from '@/domain/services/update-survivor';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import {
  CreateSurvivorRepository,
  FindSurvivorRepository,
  UpdateSurvivorRepository,
} from '../../domain/contracts/repositories/survivor';
import { CreateSurvivorService } from '../../domain/services/create-survivor';
import { DatabaseModule } from '../database/database.module';
import { PrismaSurvivorsRepository } from '../database/prisma/repositories/survivors.repository';
import { SurvivorsController } from './controllers/survivors.controller';
import { HealthModule } from './health.module';
import { SurvivorsResolver } from './resolvers/survivors';

@Module({
  imports: [
    DatabaseModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
    }),
    HealthModule,
  ],
  controllers: [SurvivorsController],
  providers: [
    {
      provide: CreateSurvivorService,
      inject: [PrismaSurvivorsRepository],
      useFactory: (prismaSurvivorRepository: PrismaSurvivorsRepository) => {
        return new CreateSurvivorService(prismaSurvivorRepository);
      },
    },
    {
      provide: UpdateSurvivorService,
      inject: [PrismaSurvivorsRepository],
      useFactory: (prismaSurvivorRepository: PrismaSurvivorsRepository) => {
        return new UpdateSurvivorService(prismaSurvivorRepository);
      },
    },
    {
      provide: GetSurvivorService,
      inject: [PrismaSurvivorsRepository],
      useFactory: (prismaSurvivorRepository: PrismaSurvivorsRepository) => {
        return new GetSurvivorService(prismaSurvivorRepository);
      },
    },
    SurvivorsResolver,
  ],
})
export class HttpModule {}
