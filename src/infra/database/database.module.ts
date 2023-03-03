import { Module } from '@nestjs/common';
import { PrismaHealthIndicator } from './prisma/prisma.health.indicator';
import { PrismaService } from './prisma/prisma.service';
import { PrismaInventoryItemsRepository } from './prisma/repositories/inventory-items.repository';
import { PrismaItemsRepository } from './prisma/repositories/items.repositoty';
import { PrismaReportsRepository } from './prisma/repositories/reports.repository';
import { PrismaSurvivorsRepository } from './prisma/repositories/survivors.repository';

@Module({
  providers: [
    PrismaService,
    PrismaHealthIndicator,
    PrismaSurvivorsRepository,
    PrismaItemsRepository,
    PrismaReportsRepository,
    PrismaInventoryItemsRepository,
  ],
  exports: [
    PrismaSurvivorsRepository,
    PrismaItemsRepository,
    PrismaReportsRepository,
    PrismaInventoryItemsRepository,
    PrismaHealthIndicator,
  ],
})
export class DatabaseModule {}
