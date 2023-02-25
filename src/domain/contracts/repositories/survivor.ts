import { Survivor } from '../../entities/survivor';

export type CreateSurvivorParams = {
  name: string;
  age: number;
  gender: string;
  latitude: number;
  longitude: number;
};

export abstract class CreateSurvivorRepository {
  abstract create(data: CreateSurvivorParams): Promise<Survivor>;
}
