import { Module } from '@nestjs/common';
import {
  CreateSurvivorRepository,
  UpdateSurvivorRepository,
} from '../../domain/contracts/repositories/survivor';
import { PrismaHealthIndicator } from './prisma/prisma.health.indicator';
import { PrismaService } from './prisma/prisma.service';
import { PrismaSurvivorsRepository } from './prisma/repositories/survivors.repository';

@Module({
  providers: [
    PrismaService,
    PrismaHealthIndicator,
    {
      provide: CreateSurvivorRepository,
      useClass: PrismaSurvivorsRepository,
    },
    {
      provide: UpdateSurvivorRepository,
      useClass: PrismaSurvivorsRepository,
    },
  ],
  exports: [
    CreateSurvivorRepository,
    UpdateSurvivorRepository,
    PrismaHealthIndicator,
  ],
})
export class DatabaseModule {}
