import { InventoryItem } from '@/domain/entities/inventory-item';

export type SaveInventoryItemParams = {
  survivorId: string;
  itemId: string;
  quantity: number;
};

export interface SaveInventoryItemRepository {
  save(data: SaveInventoryItemParams): Promise<InventoryItem>;
}

export type DeleteInventoryItemParams = {
  survivorId: string;
  itemId: string;
};

export interface DeleteInventoryItemRepository {
  delete(data: DeleteInventoryItemParams): Promise<InventoryItem>;
}
