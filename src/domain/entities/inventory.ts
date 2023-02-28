import { Item } from './item';

export class Inventory {
  item: Item;
  quantity: number;
  createdAt: Date;
  updatedAt?: Date;
}
