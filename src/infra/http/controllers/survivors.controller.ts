import { Body, Controller, Post } from '@nestjs/common';
import { CreateSurvivorService } from '../../../domain/services/create-survivor';
import { CreateSurvivorDto } from '../dtos/create-survidor.dto';

@Controller({ version: '1', path: 'survivors' })
export class SurvivorsController {
  constructor(private readonly createSurvivorService: CreateSurvivorService) {}

  @Post()
  async create(@Body() data: CreateSurvivorDto) {
    return this.createSurvivorService.execute(data);
  }
}
