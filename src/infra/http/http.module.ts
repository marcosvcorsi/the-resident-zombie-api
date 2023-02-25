import { Module } from '@nestjs/common';
import { CreateSurvivorService } from 'src/domain/services/create-survivor';
import { DatabaseModule } from '../database/database.module';
import { SurvivorsController } from './controllers/survivors.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [SurvivorsController],
  providers: [CreateSurvivorService],
})
export class HttpModule {}
