import { FindSurvivorRepository } from '@/domain/contracts/repositories/survivor';
import { NotFoundError } from '@/domain/errors';
import { GetSurvivorService } from '@/domain/services/get-survivor';
import { mock, MockProxy } from 'jest-mock-extended';

describe('GetSurvivorService', () => {
  let survivorRepository: MockProxy<FindSurvivorRepository>;
  let getSurvivorService: GetSurvivorService;

  const input = {
    id: 'any_id',
    latitude: 2,
    longitude: 2,
  };

  beforeAll(() => {
    survivorRepository = mock();

    const survivor = {
      ...input,
      age: 18,
      name: 'any_name',
      gender: 'male',
    };

    survivorRepository.find.mockResolvedValue(survivor);
  });

  beforeEach(() => {
    getSurvivorService = new GetSurvivorService(survivorRepository);
  });

  it('should be able to update a survivor and return', async () => {
    const response = await getSurvivorService.execute(input);

    expect(survivorRepository.find).toHaveBeenCalledTimes(1);
    expect(survivorRepository.find).toHaveBeenCalledWith(input.id);
    expect(response.survivor).toMatchObject(input);
  });

  it('should throw SurvivorNotFoundError if survivor does not exists', async () => {
    survivorRepository.find.mockResolvedValueOnce(null);

    await expect(getSurvivorService.execute(input)).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it('should throw SurvivorRepository throws', async () => {
    survivorRepository.find.mockRejectedValueOnce(new Error());

    await expect(getSurvivorService.execute(input)).rejects.toThrow();
  });
});
