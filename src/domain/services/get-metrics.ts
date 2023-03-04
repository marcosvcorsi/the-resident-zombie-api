import {
  GetTotalGroupByItemRepository,
  GetTotalLostPointsRepository,
} from '../contracts/repositories/item';
import { CountAllSurvivorsRepository } from '../contracts/repositories/survivor';

type ResourceAverage = {
  id: string;
  name: string;
  average: number;
};

export type GetMetricsOutput = {
  infectedPercentage: number;
  nonInfectedPercentage: number;
  totalLostPoints: number;
  resourcesAverage: ResourceAverage[];
};

export class GetMetricsService {
  constructor(
    private readonly survivorsRepository: CountAllSurvivorsRepository,
    private readonly itemsRepository: GetTotalLostPointsRepository &
      GetTotalGroupByItemRepository,
  ) {}

  async execute(): Promise<GetMetricsOutput> {
    const [
      totalSurvivors,
      totalInfected,
      totalLostPoints,
      totalGroupedByItems,
    ] = await Promise.all([
      this.survivorsRepository.count(),
      this.survivorsRepository.count({
        infected: true,
      }),
      this.itemsRepository.getTotalLostPoints(),
      this.itemsRepository.getTotalGroupByItem(),
    ]);

    const totalNonInfected = totalSurvivors - totalInfected;

    const infectedPercentage = (totalInfected * 100) / totalSurvivors;

    const nonInfectedPercentage = (totalNonInfected * 100) / totalSurvivors;

    const resourcesAverage: ResourceAverage[] = totalGroupedByItems.map(
      (item) => {
        return {
          id: item.id,
          name: item.name,
          average: item.total / totalSurvivors,
        };
      },
    );

    return {
      infectedPercentage,
      nonInfectedPercentage,
      totalLostPoints,
      resourcesAverage,
    };
  }
}
