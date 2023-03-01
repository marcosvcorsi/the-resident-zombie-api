import { ListItemsService } from '@/domain/services/list-items';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { ItemsArgs, PaginatedItemResponse } from '../schema/item';

@Resolver()
export class ItemsResolver {
  constructor(private readonly listItemsService: ListItemsService) {}

  @Query(() => PaginatedItemResponse)
  async items(@Args() { first = 20, offset = 0 }: ItemsArgs) {
    const { total, items } = await this.listItemsService.execute({
      limit: first,
      page: offset / first + 1,
    });

    return { total, data: items };
  }
}
