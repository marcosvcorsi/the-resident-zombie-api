import { Survivor } from '../entities/survivor';

export type UpdateSurvivorInput = {
  latitude: number;
  longitude: number;
};

export type UpdateSurvivorOutput = {
  survivor: Survivor;
};

export class UpdateSurvivorService {
  async execute(input: UpdateSurvivorInput): Promise<UpdateSurvivorOutput> {
    return Promise.resolve({ survivor: null });
  }
}
