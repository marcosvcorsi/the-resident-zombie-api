import { FindSurvivorRepository } from '../contracts/repositories/survivor';
import { Survivor } from '../entities/survivor';
import { NotFoundError } from '../errors';

export type GetSurvivorInput = {
  id: string;
};

export type GetSurvivorOutput = {
  survivor: Survivor;
};

export class GetSurvivorService {
  constructor(private readonly survivorsRepository: FindSurvivorRepository) {}

  async execute({ id }: GetSurvivorInput): Promise<GetSurvivorOutput> {
    const survivor = await this.survivorsRepository.find(id);

    if (!survivor) {
      throw new NotFoundError('Survivor');
    }

    return { survivor };
  }
}
