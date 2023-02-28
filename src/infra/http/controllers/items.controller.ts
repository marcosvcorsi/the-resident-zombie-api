import { ListItemsService } from '@/domain/services/list-items';
import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginatedListDto } from '../dtos/pagined-list.dto';
import { ItemViewModel } from '../views/item.view';
import { PaginatedViewModel } from '../views/paginated.view';

@Controller({ version: '1', path: 'items' })
@ApiTags('items')
export class ItemsController {
  constructor(private readonly listItemsService: ListItemsService) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    type: PaginatedViewModel<ItemViewModel>,
  })
  async getItems(@Query() { page = 1, limit = 20 }: PaginatedListDto) {
    return this.listItemsService.execute({ page, limit });
  }
}
