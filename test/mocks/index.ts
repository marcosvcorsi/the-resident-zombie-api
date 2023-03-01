import { Item } from '@/domain/entities/item';
import { Report } from '@/domain/entities/report';
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

export const mockReport = (props: Partial<Report> = {}): Report => ({
  id: 'any_report_id',
  survivor: mockSurvivor(),
  reporter: mockSurvivor({ id: 'any_reporter_id' }),
  createdAt: new Date(),
  ...props,
});
