import { CreateReportService } from '@/domain/services/create-report';
import { DeleteSurvivorService } from '@/domain/services/delete-survivor';
import { GetSurvivorService } from '@/domain/services/get-survivor';
import { ListSurvivorsService } from '@/domain/services/list-survivors';
import { TradeItemsService } from '@/domain/services/trade-items';
import { UpdateSurvivorService } from '@/domain/services/update-survivor';
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateSurvivorService } from '../../../domain/services/create-survivor';
import { CreateSurvivorDto } from '../dtos/create-survidor.dto';
import { PaginatedListDto } from '../dtos/pagined-list.dto';
import { TradeItemsDto } from '../dtos/trade-items.dto';
import { UpdateSurvivorDto } from '../dtos/update-survivor.dto';
import { ReportViewModel } from '../views/report.view';
import {
  PaginatedSurvivorsViewModel,
  SurvivorViewModel,
} from '../views/survivor.view';
import { TradeItemsViewModel } from '../views/trade-items.view';

@Controller({ version: '1', path: 'survivors' })
@ApiTags('survivors')
export class SurvivorsController {
  constructor(
    private readonly createSurvivorService: CreateSurvivorService,
    private readonly updateSurvivorService: UpdateSurvivorService,
    private readonly getSurvivorService: GetSurvivorService,
    private readonly listSurvivorsService: ListSurvivorsService,
    private readonly deleteSurvivorService: DeleteSurvivorService,
    private readonly createReportService: CreateReportService,
    private readonly tradeItemsService: TradeItemsService,
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
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  async update(@Param('id') id: string, @Body() data: UpdateSurvivorDto) {
    const { survivor } = await this.updateSurvivorService.execute({
      id,
      ...data,
    });

    return SurvivorViewModel.toHttp(survivor);
  }

  @Get('/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: SurvivorViewModel,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  async get(@Param('id') id: string) {
    const { survivor } = await this.getSurvivorService.execute({ id });

    return SurvivorViewModel.toHttp(survivor);
  }

  @Delete('/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: SurvivorViewModel,
  })
  async delete(@Param('id') id: string) {
    const { survivor } = await this.deleteSurvivorService.execute({ id });

    return SurvivorViewModel.toHttp(survivor);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    type: PaginatedSurvivorsViewModel,
  })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  async getAll(@Query() { page = 1, limit = 20 }: PaginatedListDto) {
    const { total, survivors } = await this.listSurvivorsService.execute({
      page,
      limit,
    });

    return {
      total,
      data: survivors.map(SurvivorViewModel.toHttp),
    };
  }

  @Post('/:id/reports')
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: ReportViewModel,
  })
  async createReport(
    @Param('id') survivorId: string,
    @Headers('authorization') reporterId: string,
  ) {
    if (!reporterId) {
      throw new UnauthorizedException();
    }

    const { report } = await this.createReportService.execute({
      survivorId,
      reporterId,
    });

    return report;
  }

  @Post('/:id/trades')
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: TradeItemsViewModel,
  })
  async tradeItems(
    @Param('id') receiverId: string,
    @Headers('authorization') requesterId: string,
    @Body() { receiverTradeItems, requesterTradeItems }: TradeItemsDto,
  ) {
    if (!requesterId) {
      throw new UnauthorizedException();
    }

    return this.tradeItemsService.execute({
      requesterId,
      receiverId,
      receiverTradeItems,
      requesterTradeItems,
    });
  }
}
