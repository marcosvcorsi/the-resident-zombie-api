import { Module } from '@nestjs/common';
import { PrismaHealthIndicator } from './prisma/prisma.health.indicator';
import { PrismaService } from './prisma/prisma.service';
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
  ],
  exports: [
    PrismaSurvivorsRepository,
    PrismaItemsRepository,
    PrismaReportsRepository,
    PrismaHealthIndicator,
  ],
})
export class DatabaseModule {}
