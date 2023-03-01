import {
  FindSurvivorRepository,
  UpdateSurvivorRepository,
} from '../contracts/repositories/survivor';
import { Survivor } from '../entities/survivor';
import { NotFoundError } from '../errors';

export type UpdateSurvivorInput = {
  id: string;
  latitude: number;
  longitude: number;
};

export type UpdateSurvivorOutput = {
  survivor: Survivor;
};

export class UpdateSurvivorService {
  constructor(
    private readonly survivorRepository: FindSurvivorRepository &
      UpdateSurvivorRepository,
  ) {}

  async execute({
    id,
    ...data
  }: UpdateSurvivorInput): Promise<UpdateSurvivorOutput> {
    const existingSurvivor = await this.survivorRepository.find(id);

    if (!existingSurvivor || existingSurvivor.infectedAt) {
      throw new NotFoundError('Survivor');
    }

    const survivor = await this.survivorRepository.update(id, data);

    return { survivor };
  }
}
