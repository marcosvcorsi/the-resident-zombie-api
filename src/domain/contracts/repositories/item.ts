import { Item } from '@/domain/entities/item';

export type FindAllItemsParams = {
  page: number;
  limit: number;
};

export abstract class FindAllItemsRepository {
  abstract findAll(data: FindAllItemsParams): Promise<Item[]>;
}

export abstract class CountAllItemsRepository {
  abstract count(): Promise<number>;
}
