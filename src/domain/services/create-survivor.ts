import { Injectable } from '@nestjs/common';
import { CreateSurvivorRepository } from '../contracts/repositories/survivor';
import { Survivor } from '../entities/survivor';

type CreateSurvivorInput = {
  name: string;
  age: number;
  gender: string;
  latitude: number;
  longitude: number;
};

type CreateSurvivorOutput = {
  survivor: Survivor;
};

@Injectable()
export class CreateSurvivorService {
  constructor(private readonly survivorRepository: CreateSurvivorRepository) {}

  async execute(input: CreateSurvivorInput): Promise<CreateSurvivorOutput> {
    const survivor = await this.survivorRepository.create(input);

    return { survivor };
  }
}
