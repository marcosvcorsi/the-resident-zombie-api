import { Module } from '@nestjs/common';
import { PrismaHealthIndicator } from './prisma/prisma.health.indicator';
import { PrismaService } from './prisma/prisma.service';
import { PrismaItemsRepository } from './prisma/repositories/items.repositoty';
import { PrismaSurvivorsRepository } from './prisma/repositories/survivors.repository';

@Module({
  providers: [
    PrismaService,
    PrismaHealthIndicator,
    PrismaSurvivorsRepository,
    PrismaItemsRepository,
  ],
  exports: [
    PrismaSurvivorsRepository,
    PrismaItemsRepository,
    PrismaHealthIndicator,
  ],
})
export class DatabaseModule {}
