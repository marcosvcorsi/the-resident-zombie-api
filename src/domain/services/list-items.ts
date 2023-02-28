import {
  CountAllItemsRepository,
  FindAllItemsRepository,
} from '../contracts/repositories/item';
import { Item } from '../entities/item';

export type ListItemsInput = {
  page: number;
  limit: number;
};

export type ListItemsOutput = {
  total: number;
  items: Item[];
};

export class ListItemsService {
  constructor(
    private readonly itemsRepository: CountAllItemsRepository &
      FindAllItemsRepository,
  ) {}

  async execute({ page, limit }: ListItemsInput): Promise<ListItemsOutput> {
    const total = await this.itemsRepository.count();

    const items = await this.itemsRepository.findAll({
      page,
      limit,
    });

    return {
      total,
      items,
    };
  }
}
