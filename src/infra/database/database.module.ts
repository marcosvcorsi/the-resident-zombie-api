import { Module } from '@nestjs/common';
import { CreateSurvivorRepository } from 'src/domain/contracts/repositories/survivor';
import { PrismaService } from './prisma/prisma.service';
import { PrismaSurvivorsRepository } from './prisma/repositories/survivors.repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: CreateSurvivorRepository,
      useClass: PrismaSurvivorsRepository,
    },
  ],
  exports: [CreateSurvivorRepository],
})
export class DatabaseModule {}
