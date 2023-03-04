import {
  GetTotalGroupByItemRepository,
  GetTotalLostPointsRepository,
} from '@/domain/contracts/repositories/item';
import { CountAllSurvivorsRepository } from '@/domain/contracts/repositories/survivor';
import { GetMetricsService } from '@/domain/services/get-metrics';
import { mock, MockProxy } from 'jest-mock-extended';

describe('GetMetricsService', () => {
  let getMetricsService: GetMetricsService;
  let survivorsRepository: MockProxy<CountAllSurvivorsRepository>;
  let itemsRepository: MockProxy<
    GetTotalLostPointsRepository & GetTotalGroupByItemRepository
  >;

  beforeAll(() => {
    survivorsRepository = mock();
    itemsRepository = mock();
  });

  beforeEach(() => {
    survivorsRepository.count
      .mockResolvedValueOnce(100)
      .mockResolvedValueOnce(50);

    itemsRepository.getTotalLostPoints.mockResolvedValueOnce(20);
    itemsRepository.getTotalGroupByItem.mockResolvedValueOnce([
      {
        id: 'any_id',
        name: 'any_name',
        total: 10,
      },
    ]);

    getMetricsService = new GetMetricsService(
      survivorsRepository,
      itemsRepository,
    );
  });

  it('should return metrics', async () => {
    const response = await getMetricsService.execute();

    expect(response).toEqual({
      infectedPercentage: 50,
      nonInfectedPercentage: 50,
      totalLostPoints: 20,
      resourcesAverage: [
        {
          id: 'any_id',
          name: 'any_name',
          average: 0.1,
        },
      ],
    });
  });
});
