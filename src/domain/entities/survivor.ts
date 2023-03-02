import { InventoryItem } from './inventory-item';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export type Survivor = {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  latitude: number;
  longitude: number;
  createdAt: Date;
  updatedAt?: Date;
  infectedAt?: Date;
  inventoryItems: InventoryItem[];
};
