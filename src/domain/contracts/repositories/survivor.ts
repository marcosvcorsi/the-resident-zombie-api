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
