import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { CreateSurvivorRepository } from '../../domain/contracts/repositories/survivor';
import { CreateSurvivorService } from '../../domain/services/create-survivor';
import { DatabaseModule } from '../database/database.module';
import { SurvivorsController } from './controllers/survivors.controller';
import { SurvivorsResolver } from './resolvers/survivors';

@Module({
  imports: [
    DatabaseModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
    }),
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
    SurvivorsResolver,
  ],
})
export class HttpModule {}
