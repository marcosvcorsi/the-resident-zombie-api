import { Gender, Survivor } from '../../entities/survivor';

export type CreateSurvivorParams = {
  name: string;
  gender: Gender;
  age: number;
  latitude: number;
  longitude: number;
  inventoryItems?: {
    itemId: string;
    quantity: number;
  }[];
};

export interface CreateSurvivorRepository {
  create(data: CreateSurvivorParams): Promise<Survivor>;
}

export type UpdateSurvivorParams = Partial<Omit<Survivor, 'inventoryItems'>>;

export interface UpdateSurvivorRepository {
  update(id: string, data: UpdateSurvivorParams): Promise<Survivor>;
}

export interface FindSurvivorRepository {
  find(id: string): Promise<Survivor | null>;
}

export type FindAllSurvivorsParams = {
  page: number;
  limit: number;
};

export interface FindAllSurvivorsRepository {
  findAll(data: FindAllSurvivorsParams): Promise<Survivor[]>;
}

export type CountAllSurvivorsParams = {
  infected?: boolean;
};

export interface CountAllSurvivorsRepository {
  count(data?: CountAllSurvivorsParams): Promise<number>;
}

export interface DeleteSurvivorRepository {
  delete(id: string): Promise<Survivor>;
}
