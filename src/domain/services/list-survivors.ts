import {
  CountAllSurvivorsRepository,
  FindAllSurvivorsRepository,
} from '../contracts/repositories/survivor';
import { Survivor } from '../entities/survivor';

export type ListSurvivorsInput = {
  page: number;
  limit: number;
};

export type ListSurvivorsOutput = {
  survivors: Survivor[];
  total: number;
};

export class ListSurvivorsService {
  constructor(
    private readonly survivorsRepository: CountAllSurvivorsRepository &
      FindAllSurvivorsRepository,
  ) {}

  async execute({
    page,
    limit,
  }: ListSurvivorsInput): Promise<ListSurvivorsOutput> {
    const total = await this.survivorsRepository.count();

    const survivors = await this.survivorsRepository.findAll({
      page,
      limit,
    });

    return { total, survivors };
  }
}
