import { DeleteSurvivorService } from '@/domain/services/delete-survivor';
import { GetSurvivorService } from '@/domain/services/get-survivor';
import { ListItemsService } from '@/domain/services/list-items';
import { ListSurvivorsService } from '@/domain/services/list-survivors';
import { UpdateSurvivorService } from '@/domain/services/update-survivor';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { CreateSurvivorService } from '../../domain/services/create-survivor';
import { DatabaseModule } from '../database/database.module';
import { PrismaItemsRepository } from '../database/prisma/repositories/items.repositoty';
import { PrismaSurvivorsRepository } from '../database/prisma/repositories/survivors.repository';
import { ItemsController } from './controllers/items.controller';
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
  controllers: [SurvivorsController, ItemsController],
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
    {
      provide: ListSurvivorsService,
      inject: [PrismaSurvivorsRepository],
      useFactory: (prismaSurvivorRepository: PrismaSurvivorsRepository) => {
        return new ListSurvivorsService(prismaSurvivorRepository);
      },
    },
    {
      provide: DeleteSurvivorService,
      inject: [PrismaSurvivorsRepository],
      useFactory: (prismaSurvivorRepository: PrismaSurvivorsRepository) => {
        return new DeleteSurvivorService(prismaSurvivorRepository);
      },
    },
    {
      provide: ListItemsService,
      inject: [PrismaItemsRepository],
      useFactory: (prismaItemsRepository: PrismaItemsRepository) => {
        return new ListItemsService(prismaItemsRepository);
      },
    },
    SurvivorsResolver,
  ],
})
export class HttpModule {}
