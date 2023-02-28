import {
  DeleteSurvivorRepository,
  FindSurvivorRepository,
} from '../contracts/repositories/survivor';
import { Survivor } from '../entities/survivor';
import { NotFoundError } from '../errors';

export type DeleteSurvivorInput = {
  id: string;
};

export type DeleteSurvivorOutput = {
  survivor: Survivor;
};

export class DeleteSurvivorService {
  constructor(
    private readonly survivorsRepository: FindSurvivorRepository &
      DeleteSurvivorRepository,
  ) {}

  async execute({ id }: DeleteSurvivorInput): Promise<DeleteSurvivorOutput> {
    let survivor = await this.survivorsRepository.find(id);

    if (!survivor) {
      throw new NotFoundError('Survivor');
    }

    survivor = await this.survivorsRepository.delete(id);

    return { survivor };
  }
}
