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

export interface GetTotalLostPointsRepository {
  getTotalLostPoints(): Promise<number>;
}

type GetTotalGroupByItemResponse = {
  id: string;
  name: string;
  total: number;
};

export interface GetTotalGroupByItemRepository {
  getTotalGroupByItem(): Promise<GetTotalGroupByItemResponse[]>;
}
