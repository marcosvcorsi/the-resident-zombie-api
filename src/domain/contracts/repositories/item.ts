import { Item } from '@/domain/entities/item';

export type FindAllItemsParams = {
  page: number;
  limit: number;
};

export interface FindAllItemsRepository {
  findAll(data: FindAllItemsParams): Promise<Item[]>;
}

export interface CountAllItemsRepository {
  count(): Promise<number>;
}
