import { Inventory } from './inventory';

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
  inventory: Inventory[];
};
