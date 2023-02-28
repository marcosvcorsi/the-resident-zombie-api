import { Item } from '@/domain/entities/item';
import { Gender, Survivor } from '@/domain/entities/survivor';

export const mockSurvivor = (props: Partial<Survivor> = {}): Survivor => ({
  id: 'any_id',
  age: 18,
  name: 'any name',
  createdAt: new Date(),
  gender: Gender.MALE,
  latitude: 1,
  longitude: 1,
  inventory: [],
  ...props,
});

export const mockItem = (props: Partial<Item> = {}): Item => ({
  id: 'any_id',
  name: 'any_item',
  points: 1,
  ...props,
});
