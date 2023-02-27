import {
  CountAllSurvivorsRepository,
  FindAllSurvivorsRepository,
} from '@/domain/contracts/repositories/survivor';
import { ListSurvivorsService } from '@/domain/services/list-survivors';
import { mock, MockProxy } from 'jest-mock-extended';

describe('ListSurvivorsService', () => {
  let survivorsRepository: MockProxy<
    CountAllSurvivorsRepository & FindAllSurvivorsRepository
  >;
  let listSurvivorsService: ListSurvivorsService;

  const input = {
    page: 1,
    limit: 20,
  };

  const survivor = {
    id: 'any_id',
    name: 'any_name',
    gender: 'any_gender',
    age: 18,
    latitude: 1,
    longitude: 1,
  };

  beforeAll(() => {
    survivorsRepository = mock();

    survivorsRepository.count.mockResolvedValue(1);
    survivorsRepository.findAll.mockResolvedValue([survivor]);
  });

  beforeEach(() => {
    listSurvivorsService = new ListSurvivorsService(survivorsRepository);
  });

  it('should return a list and total of survivors', async () => {
    const response = await listSurvivorsService.execute(input);

    expect(survivorsRepository.count).toHaveBeenCalledTimes(1);
    expect(survivorsRepository.findAll).toHaveBeenCalledTimes(1);
    expect(survivorsRepository.findAll).toHaveBeenCalledWith(input);
    expect(response).toEqual({ survivors: [survivor], total: 1 });
  });

  it('should throw if SurvivorRepository throws', async () => {
    survivorsRepository.count.mockRejectedValueOnce(new Error());

    await expect(listSurvivorsService.execute(input)).rejects.toThrow();
  });
});
