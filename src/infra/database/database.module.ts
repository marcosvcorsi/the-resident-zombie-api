import { Module } from '@nestjs/common';
import { PrismaHealthIndicator } from './prisma/prisma.health.indicator';
import { PrismaService } from './prisma/prisma.service';
import { PrismaSurvivorsRepository } from './prisma/repositories/survivors.repository';

@Module({
  providers: [PrismaService, PrismaHealthIndicator, PrismaSurvivorsRepository],
  exports: [PrismaSurvivorsRepository, PrismaHealthIndicator],
})
export class DatabaseModule {}
