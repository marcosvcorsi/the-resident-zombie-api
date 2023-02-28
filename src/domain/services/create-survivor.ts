import { CreateSurvivorRepository } from '../contracts/repositories/survivor';
import { Gender, Survivor } from '../entities/survivor';

type CreateSurvivorInput = {
  name: string;
  age: number;
  gender: Gender;
  latitude: number;
  longitude: number;
  inventory: {
    itemId: string;
    quantity: number;
  }[];
};

type CreateSurvivorOutput = {
  survivor: Survivor;
};

export class CreateSurvivorService {
  constructor(private readonly survivorRepository: CreateSurvivorRepository) {}

  async execute(input: CreateSurvivorInput): Promise<CreateSurvivorOutput> {
    const survivor = await this.survivorRepository.create(input);

    return { survivor };
  }
}
