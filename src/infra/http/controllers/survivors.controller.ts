import { UpdateSurvivorService } from '@/domain/services/update-survivor';
import {
  Body,
  Controller,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateSurvivorService } from '../../../domain/services/create-survivor';
import { CreateSurvivorDto } from '../dtos/create-survidor.dto';
import { UpdateSurvivorDto } from '../dtos/update-survivor.dto';
import { SurvivorViewModel } from '../views/survivor.view';

@Controller({ version: '1', path: 'survivors' })
@ApiTags('survivors')
export class SurvivorsController {
  constructor(
    private readonly createSurvivorService: CreateSurvivorService,
    private readonly updateSurvivorService: UpdateSurvivorService,
  ) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SurvivorViewModel,
  })
  async create(@Body() data: CreateSurvivorDto) {
    const { survivor } = await this.createSurvivorService.execute(data);

    return SurvivorViewModel.toHttp(survivor);
  }

  @Patch('/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: SurvivorViewModel,
  })
  async update(@Param('id') id: string, @Body() data: UpdateSurvivorDto) {
    const { survivor } = await this.updateSurvivorService.execute({
      id,
      ...data,
    });

    return SurvivorViewModel.toHttp(survivor);
  }
}
