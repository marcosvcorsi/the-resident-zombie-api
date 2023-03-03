export type SaveInventoryItemParams = {
  survivorId: string;
  itemId: string;
  quantity: number;
};

export interface OpenInventoryItemTransaction {
  beginTransaction(): Promise<void>;
  commit(): Promise<void>;
}

export interface SaveInventoryItemRepository {
  save(data: SaveInventoryItemParams): Promise<void>;
}

export type DeleteInventoryItemParams = {
  survivorId: string;
  itemId: string;
};

export interface DeleteInventoryItemRepository {
  delete(data: DeleteInventoryItemParams): Promise<void>;
}
