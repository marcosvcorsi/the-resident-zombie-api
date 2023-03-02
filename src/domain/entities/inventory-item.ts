import { Item } from './item';

export class InventoryItem {
  item: Item;
  quantity: number;
  createdAt: Date;
  updatedAt?: Date;
}
