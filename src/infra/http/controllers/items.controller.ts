import { ListItemsService } from '@/domain/services/list-items';
import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginatedListDto } from '../dtos/pagined-list.dto';
import { PaginatedItemsViewModel } from '../views/item.view';

@Controller({ version: '1', path: 'items' })
@ApiTags('items')
export class ItemsController {
  constructor(private readonly listItemsService: ListItemsService) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    type: PaginatedItemsViewModel,
  })
  async getItems(@Query() { page = 1, limit = 20 }: PaginatedListDto) {
    const { total, items } = await this.listItemsService.execute({
      page,
      limit,
    });

    return { total, data: items };
  }
}
