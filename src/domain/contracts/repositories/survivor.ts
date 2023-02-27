import { Survivor } from '../../entities/survivor';

export type CreateSurvivorParams = Omit<Survivor, 'id'>;

export abstract class CreateSurvivorRepository {
  abstract create(data: CreateSurvivorParams): Promise<Survivor>;
}

export type UpdateSurvivorParams = Partial<Omit<Survivor, 'id'>>;

export abstract class UpdateSurvivorRepository {
  abstract update(id: string, data: UpdateSurvivorParams): Promise<Survivor>;
}

export abstract class FindSurvivorRepository {
  abstract find(id: string): Promise<Survivor | null>;
}

export type FindAllSurvivorsParams = {
  page: number;
  limit: number;
};

export abstract class FindAllSurvivorsRepository {
  abstract findAll(data: FindAllSurvivorsParams): Promise<Survivor[]>;
}

export abstract class CountAllSurvivorsRepository {
  abstract count(): Promise<number>;
}

export abstract class DeleteSurvivorRepository {
  abstract delete(id: string): Promise<Survivor>;
}
