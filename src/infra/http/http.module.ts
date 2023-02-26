import { UpdateSurvivorService } from '@/domain/services/update-survivor';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import {
  CreateSurvivorRepository,
  UpdateSurvivorRepository,
} from '../../domain/contracts/repositories/survivor';
import { CreateSurvivorService } from '../../domain/services/create-survivor';
import { DatabaseModule } from '../database/database.module';
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
      inject: [CreateSurvivorRepository],
      useFactory: (createSurvivorRepository: CreateSurvivorRepository) => {
        return new CreateSurvivorService(createSurvivorRepository);
      },
    },
    {
      provide: UpdateSurvivorService,
      inject: [UpdateSurvivorRepository],
      useFactory: (updateSurvivorRepository: UpdateSurvivorRepository) => {
        return new UpdateSurvivorService(updateSurvivorRepository);
      },
    },
    SurvivorsResolver,
  ],
})
export class HttpModule {}
