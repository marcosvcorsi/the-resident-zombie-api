import { Module } from '@nestjs/common';
import { CreateSurvivorRepository } from 'src/domain/contracts/repositories/survivor';
import { CreateSurvivorService } from 'src/domain/services/create-survivor';
import { DatabaseModule } from '../database/database.module';
import { SurvivorsController } from './controllers/survivors.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [SurvivorsController],
  providers: [
    {
      provide: CreateSurvivorService,
      inject: [CreateSurvivorRepository],
      useFactory: (createSurvivorRepository: CreateSurvivorRepository) => {
        return new CreateSurvivorService(createSurvivorRepository);
      },
    },
  ],
})
export class HttpModule {}
