import {
  FindSurvivorRepository,
  UpdateSurvivorRepository,
} from '@/domain/contracts/repositories/survivor';
import { NotFoundError } from '@/domain/errors';
import { UpdateSurvivorService } from '@/domain/services/update-survivor';
import { mock, MockProxy } from 'jest-mock-extended';

describe('UpdateSurvivorService', () => {
  let survivorRepository: MockProxy<
    UpdateSurvivorRepository & FindSurvivorRepository
  >;
  let updateSurvivorService: UpdateSurvivorService;

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
      createdAt: new Date(),
    };

    survivorRepository.find.mockResolvedValue(survivor);
    survivorRepository.update.mockResolvedValue(survivor);
  });

  beforeEach(() => {
    updateSurvivorService = new UpdateSurvivorService(survivorRepository);
  });

  it('should be able to update a survivor and return', async () => {
    const response = await updateSurvivorService.execute(input);

    expect(survivorRepository.update).toHaveBeenCalledTimes(1);
    expect(survivorRepository.update).toHaveBeenCalledWith(input.id, {
      latitude: input.latitude,
      longitude: input.longitude,
    });
    expect(response.survivor).toMatchObject(input);
  });

  it('should throw SurvivorNotFoundError if survivor does not exists', async () => {
    survivorRepository.find.mockResolvedValueOnce(null);

    await expect(updateSurvivorService.execute(input)).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it('should throw SurvivorRepository throws', async () => {
    survivorRepository.find.mockRejectedValueOnce(new Error());

    await expect(updateSurvivorService.execute(input)).rejects.toThrow();
  });
});
