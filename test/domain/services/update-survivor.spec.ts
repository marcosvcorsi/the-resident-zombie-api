import { UpdateSurvivorRepository } from '@/domain/contracts/repositories/survivor';
import { UpdateSurvivorService } from '@/domain/services/update-survivor';
import { mock, MockProxy } from 'jest-mock-extended';

describe('UpdateSurvivorService', () => {
  let survivorRepository: MockProxy<UpdateSurvivorRepository>;
  let updateSurvivorService: UpdateSurvivorService;

  const input = {
    id: 'any_id',
    latitude: 2,
    longitude: 2,
  };

  beforeAll(() => {
    survivorRepository = mock();

    survivorRepository.update.mockResolvedValue({
      ...input,
      age: 18,
      name: 'any_name',
      gender: 'male',
    });
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
});
