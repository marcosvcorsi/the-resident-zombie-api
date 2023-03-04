import { CreateReportService } from '@/domain/services/create-report';
import { DeleteSurvivorService } from '@/domain/services/delete-survivor';
import { GetMetricsService } from '@/domain/services/get-metrics';
import { GetSurvivorService } from '@/domain/services/get-survivor';
import { ListItemsService } from '@/domain/services/list-items';
import { ListSurvivorsService } from '@/domain/services/list-survivors';
import { TradeItemsService } from '@/domain/services/trade-items';
import { UpdateSurvivorService } from '@/domain/services/update-survivor';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { CreateSurvivorService } from '../../domain/services/create-survivor';
import { DatabaseModule } from '../database/database.module';
import { PrismaInventoryItemsRepository } from '../database/prisma/repositories/inventory-items.repository';
import { PrismaItemsRepository } from '../database/prisma/repositories/items.repositoty';
import { PrismaReportsRepository } from '../database/prisma/repositories/reports.repository';
import { PrismaSurvivorsRepository } from '../database/prisma/repositories/survivors.repository';
import { DashboardController } from './controllers/dashboard.controller';
import { ItemsController } from './controllers/items.controller';
import { SurvivorsController } from './controllers/survivors.controller';
import { HealthModule } from './health.module';
import { ItemsResolver } from './resolvers/items';
import { ReportsResolver } from './resolvers/reports';
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
  controllers: [SurvivorsController, ItemsController, DashboardController],
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
    {
      provide: CreateReportService,
      inject: [PrismaSurvivorsRepository, PrismaReportsRepository],
      useFactory: (
        prismaSurvivorsRepository: PrismaSurvivorsRepository,
        prismaReportsRepository: PrismaReportsRepository,
      ) => {
        return new CreateReportService(
          prismaSurvivorsRepository,
          prismaReportsRepository,
        );
      },
    },
    {
      provide: TradeItemsService,
      inject: [PrismaSurvivorsRepository, PrismaInventoryItemsRepository],
      useFactory: (
        prismaSurvivorsRepository: PrismaSurvivorsRepository,
        prismaInventoryItemRepository: PrismaInventoryItemsRepository,
      ) => {
        return new TradeItemsService(
          prismaSurvivorsRepository,
          prismaInventoryItemRepository,
        );
      },
    },
    {
      provide: GetMetricsService,
      inject: [PrismaSurvivorsRepository, PrismaInventoryItemsRepository],
      useFactory: (
        prismaSurvivorsRepository: PrismaSurvivorsRepository,
        prismaInventoryItemRepository: PrismaInventoryItemsRepository,
      ) => {
        return new GetMetricsService(
          prismaSurvivorsRepository,
          prismaInventoryItemRepository,
        );
      },
    },
    SurvivorsResolver,
    ItemsResolver,
    ReportsResolver,
  ],
})
export class HttpModule {}
