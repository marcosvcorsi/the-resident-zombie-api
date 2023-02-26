import { UpdateSurvivorRepository } from '../contracts/repositories/survivor';
import { Survivor } from '../entities/survivor';

export type UpdateSurvivorInput = {
  id: string;
  latitude: number;
  longitude: number;
};

export type UpdateSurvivorOutput = {
  survivor: Survivor;
};

export class UpdateSurvivorService {
  constructor(private readonly survivorRepository: UpdateSurvivorRepository) {}

  async execute({
    id,
    ...data
  }: UpdateSurvivorInput): Promise<UpdateSurvivorOutput> {
    const survivor = await this.survivorRepository.update(id, data);

    return { survivor };
  }
}
