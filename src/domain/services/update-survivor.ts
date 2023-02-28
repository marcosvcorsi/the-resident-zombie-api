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
    let survivor = await this.survivorRepository.find(id);

    if (!survivor) {
      throw new NotFoundError('Survivor');
    }

    survivor = await this.survivorRepository.update(id, data);

    return { survivor };
  }
}
