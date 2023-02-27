import { SurvivorNotFoundError } from '@/domain/errors/survivor';
import { GetSurvivorService } from '@/domain/services/get-survivor';
import { UpdateSurvivorService } from '@/domain/services/update-survivor';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
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
    private readonly getSurvivorService: GetSurvivorService,
  ) {}

  private handleSurvivorNotFoundError(error: unknown) {
    if (error instanceof SurvivorNotFoundError) {
      throw new NotFoundException(error.message);
    }

    throw new InternalServerErrorException(error);
  }

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
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  async update(@Param('id') id: string, @Body() data: UpdateSurvivorDto) {
    try {
      const { survivor } = await this.updateSurvivorService.execute({
        id,
        ...data,
      });

      return SurvivorViewModel.toHttp(survivor);
    } catch (error) {
      this.handleSurvivorNotFoundError(error);
    }
  }

  @Get('/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: SurvivorViewModel,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  async get(@Param('id') id: string) {
    try {
      const { survivor } = await this.getSurvivorService.execute({ id });

      return SurvivorViewModel.toHttp(survivor);
    } catch (error) {
      this.handleSurvivorNotFoundError(error);
    }
  }
}
